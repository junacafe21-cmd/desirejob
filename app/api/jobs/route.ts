import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const jobType = searchParams.get('job_type');
    const active = searchParams.get('active');

    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (location) query = query.eq('location', location);
    if (jobType) query = query.eq('job_type', jobType);
    if (active !== null) query = query.eq('is_active', active === 'true');

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();

    const { title, company, location, salary, description, contact_info, category, job_type, deadline } = body;

    if (!title || !company || !location || !description || !contact_info) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert({ title, company, location, salary, description, contact_info, category: category || 'General', job_type: job_type || 'Full-Time', deadline })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
