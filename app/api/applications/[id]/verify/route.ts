import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createAdminClient();
    const { action, admin_note } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get application with job details
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*, job:jobs(*)')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // Update application status
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        status: newStatus,
        admin_note: admin_note || null,
        credited: action === 'approve',
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    if (action === 'approve') {
      // Update payment as verified
      await supabase
        .from('payments')
        .update({ verified: true, verified_at: new Date().toISOString() })
        .eq('application_id', id);

      // Upsert user credits (+3)
      const { data: existingCredits } = await supabase
        .from('user_credits')
        .select('*')
        .eq('email', application.user_email)
        .single();

      if (existingCredits) {
        await supabase
          .from('user_credits')
          .update({
            credits: existingCredits.credits + 3,
            total_paid: existingCredits.total_paid + 500,
          })
          .eq('email', application.user_email);
      } else {
        await supabase.from('user_credits').insert({
          email: application.user_email,
          credits: 3,
          total_paid: 500,
        });
      }

      // Send approval email with job details
      const job = application.job;
      if (job && process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Desire Job Hub <noreply@desirejobhub.com>',
          to: application.user_email,
          subject: `✅ Application Approved – ${job.title} at ${job.company}`,
          html: buildApprovalEmail(application, job),
        });
      }
    } else {
      // Send rejection email
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Desire Job Hub <noreply@desirejobhub.com>',
          to: application.user_email,
          subject: `Application Update – ${application.job?.title}`,
          html: buildRejectionEmail(application, admin_note),
        });
      }
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildApprovalEmail(application: Record<string, unknown>, job: Record<string, unknown>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1E3A5F,#2D5A8E);padding:32px 40px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="width:36px;height:36px;background:#F97316;border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:18px;">💼</span>
        </div>
        <span style="color:#F97316;font-size:18px;font-weight:900;font-style:italic;">Desire</span>
        <span style="color:white;font-size:14px;font-weight:700;letter-spacing:2px;">JOB HUB</span>
      </div>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Nepal's Premier Job Portal</p>
    </div>

    <!-- Success banner -->
    <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:20px 40px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">✅</div>
      <h1 style="color:#166534;font-size:22px;margin:0 0 4px;">Payment Approved!</h1>
      <p style="color:#15803d;margin:0;font-size:15px;">Your job application has been verified</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">
        Dear <strong>${application.user_name}</strong>,<br><br>
        Great news! Your payment of <strong>NPR 500</strong> has been verified. Here are the full details for the position you applied for:
      </p>

      <!-- Job details card -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:24px;margin-bottom:20px;">
        <h2 style="color:#1E3A5F;font-size:20px;margin:0 0 4px;">${job.title}</h2>
        <p style="color:#2D5A8E;font-size:15px;font-weight:600;margin:0 0 16px;">${job.company}</p>
        
        <div style="display:grid;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#6b7280;font-size:13px;min-width:80px;">📍 Location:</span>
            <span style="color:#111827;font-size:14px;font-weight:500;">${job.location}</span>
          </div>
          ${job.salary ? `<div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#6b7280;font-size:13px;min-width:80px;">💰 Salary:</span>
            <span style="color:#111827;font-size:14px;font-weight:500;">${job.salary}</span>
          </div>` : ''}
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="color:#6b7280;font-size:13px;min-width:80px;">⏰ Type:</span>
            <span style="color:#111827;font-size:14px;font-weight:500;">${job.job_type}</span>
          </div>
        </div>
      </div>

      <!-- Contact info card -->
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:24px;margin-bottom:20px;">
        <h3 style="color:#c2410c;font-size:15px;margin:0 0 12px;">📞 Contact Information</h3>
        <p style="color:#7c3aed;font-size:14px;font-weight:600;margin:0;white-space:pre-line;">${job.contact_info}</p>
      </div>

      <!-- Job description -->
      <div style="margin-bottom:24px;">
        <h3 style="color:#1E3A5F;font-size:15px;margin:0 0 8px;">📄 Job Description</h3>
        <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0;">${job.description}</p>
      </div>

      <!-- Credits info -->
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#0369a1;font-size:14px;margin:0;">
          💡 You now have <strong>3 job unlock credits</strong>. Apply to more jobs without paying again!
        </p>
      </div>

      <p style="color:#6b7280;font-size:13px;text-align:center;margin:0;">
        Good luck with your application! 🍀<br>
        <strong>Desire Job Hub Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        © 2025 Desire Job Hub · Kathmandu, Nepal<br>
        <a href="https://desirejobhub.com" style="color:#F97316;text-decoration:none;">www.desirejobhub.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function buildRejectionEmail(application: Record<string, unknown>, note?: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1E3A5F,#2D5A8E);padding:32px 40px;text-align:center;">
      <span style="color:#F97316;font-size:20px;font-weight:900;font-style:italic;">Desire</span>
      <span style="color:white;font-size:14px;font-weight:700;letter-spacing:2px;margin-left:4px;">JOB HUB</span>
    </div>
    <div style="padding:32px 40px;">
      <h2 style="color:#991b1b;margin:0 0 16px;">Payment Verification Update</h2>
      <p style="color:#374151;font-size:15px;">Dear <strong>${application.user_name}</strong>,</p>
      <p style="color:#374151;font-size:14px;line-height:1.7;">
        Unfortunately, we were unable to verify your payment screenshot. 
        ${note ? `<br><br><strong>Reason:</strong> ${note}` : ''}
        <br><br>
        Please reapply with a clear screenshot of your eSewa payment confirmation showing:
      </p>
      <ul style="color:#4b5563;font-size:14px;line-height:2;">
        <li>Transaction ID</li>
        <li>Amount (NPR 500)</li>
        <li>Date & time of payment</li>
      </ul>
      <p style="color:#6b7280;font-size:13px;">
        If you believe this is an error, please contact us at info@desirejobhub.com
      </p>
    </div>
    <div style="background:#f8fafc;padding:16px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2025 Desire Job Hub · Nepal</p>
    </div>
  </div>
</body>
</html>
  `;
}
