import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const formData = await request.formData();

    const jobId = formData.get('job_id') as string;
    const userName = formData.get('user_name') as string;
    const userEmail = formData.get('user_email') as string;
    const userPhone = formData.get('user_phone') as string;
    const paymentScreenshot = formData.get('payment_screenshot') as File;
    const cvFile = formData.get('cv_file') as File | null;

    if (!jobId || !userName || !userEmail || !userPhone || !paymentScreenshot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload payment screenshot
    const screenshotExt = paymentScreenshot.name.split('.').pop();
    const screenshotPath = `${userEmail}/${Date.now()}-payment.${screenshotExt}`;
    const screenshotBuffer = await paymentScreenshot.arrayBuffer();

    const { error: screenshotError } = await supabase.storage
      .from('payment-screenshots')
      .upload(screenshotPath, Buffer.from(screenshotBuffer), {
        contentType: paymentScreenshot.type,
        upsert: false,
      });

    if (screenshotError) {
      console.error('Screenshot upload error:', screenshotError);
      return NextResponse.json({ error: 'Failed to upload payment screenshot' }, { status: 500 });
    }

    // Upload CV if provided
    let cvUrl: string | null = null;
    if (cvFile && cvFile.size > 0) {
      const cvExt = cvFile.name.split('.').pop();
      const cvPath = `${userEmail}/${Date.now()}-cv.${cvExt}`;
      const cvBuffer = await cvFile.arrayBuffer();

      const { error: cvError } = await supabase.storage
        .from('cv-uploads')
        .upload(cvPath, Buffer.from(cvBuffer), {
          contentType: cvFile.type,
          upsert: false,
        });

      if (!cvError) {
        const { data: cvUrlData } = supabase.storage.from('cv-uploads').getPublicUrl(cvPath);
        cvUrl = cvUrlData.publicUrl;
      }
    }

    // Create application record
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        payment_screenshot_url: screenshotPath,
        cv_url: cvUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (appError) {
      console.error('Application insert error:', appError);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    // Create payment record
    await supabase.from('payments').insert({
      application_id: application.id,
      user_email: userEmail,
      amount: 500,
      credits_added: 3,
      verified: false,
    });

    return NextResponse.json({ success: true, applicationId: application.id }, { status: 201 });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('applications')
      .select('*, job:jobs(id, title, company, location)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
