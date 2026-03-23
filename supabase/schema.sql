-- ============================================================
-- DESIRE JOB HUB - Complete Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: profiles (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  credits INTEGER DEFAULT 0,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  job_type TEXT NOT NULL DEFAULT 'Full-Time' CHECK (job_type IN ('Full-Time', 'Part-Time', 'Contract', 'Remote', 'Internship')),
  is_active BOOLEAN DEFAULT TRUE,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: applications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  cv_url TEXT,
  payment_screenshot_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  credited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  amount INTEGER DEFAULT 500,
  credits_added INTEGER DEFAULT 3,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: user_credits (tracks credits per email for non-auth users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 0,
  total_paid INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: cvs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cvs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email TEXT NOT NULL,
  data_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_user_email ON public.applications(user_email);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON public.payments(user_email);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cvs_updated_at BEFORE UPDATE ON public.cvs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER: Auto-create profile on auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 
    CASE WHEN new.email = current_setting('app.admin_email', true) THEN 'admin' ELSE 'user' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- JOBS policies (public read, admin write)
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admin can manage jobs" ON public.jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- APPLICATIONS policies
CREATE POLICY "Anyone can INSERT applications" ON public.applications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
CREATE POLICY "Admin can manage all applications" ON public.applications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PAYMENTS policies
CREATE POLICY "Admin can manage all payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can insert payments" ON public.payments FOR INSERT WITH CHECK (TRUE);

-- USER_CREDITS policies
CREATE POLICY "Anyone can read own credits by email" ON public.user_credits FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage user credits" ON public.user_credits FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can insert user credits" ON public.user_credits FOR INSERT WITH CHECK (TRUE);

-- CVS policies
CREATE POLICY "Anyone can insert CVs" ON public.cvs FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own CVs" ON public.cvs FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage CVs" ON public.cvs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- STORAGE BUCKETS (run via Supabase Dashboard or these SQL snippets)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-uploads', 'cv-uploads', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('qr-codes', 'qr-codes', TRUE) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload payment screenshot" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots');
CREATE POLICY "Admin can view payment screenshots" ON storage.objects FOR SELECT USING (
  bucket_id = 'payment-screenshots' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can upload CV" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-uploads');
CREATE POLICY "QR codes are public" ON storage.objects FOR SELECT USING (bucket_id = 'qr-codes');

-- ============================================================
-- SAMPLE DATA: Admin user (update email after creating in auth)
-- ============================================================
-- After creating admin user in Supabase Auth dashboard, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin@email.com';

-- ============================================================
-- SAMPLE DATA: Job listings
-- ============================================================
INSERT INTO public.jobs (title, company, location, salary, description, contact_info, category, job_type) VALUES
(
  'Senior Software Engineer',
  'Leapfrog Technology',
  'Kathmandu',
  'NPR 80,000 - 120,000',
  'We are looking for an experienced Software Engineer to join our dynamic team. You will work on cutting-edge projects using modern technologies.',
  'Email: careers@leapfrog.com | Phone: 01-5970000 | Apply via: https://leapfrog.com/careers',
  'Technology',
  'Full-Time'
),
(
  'Digital Marketing Manager',
  'Daraz Nepal',
  'Kathmandu',
  'NPR 60,000 - 90,000',
  'Lead our digital marketing initiatives across all platforms. Drive customer acquisition and retention through data-driven campaigns.',
  'Email: jobs@daraz.com.np | Contact HR at 01-4444444',
  'Marketing',
  'Full-Time'
),
(
  'Operations Manager',
  'Nepal Airlines Corporation',
  'Kathmandu',
  'NPR 70,000 - 100,000',
  'Oversee daily operational activities and coordinate between departments. Ensure smooth and efficient operations across all functions.',
  'Email: hr@nepalairlines.com | Phone: 01-4411020',
  'Operations',
  'Full-Time'
),
(
  'Graphic Designer',
  'Ncell Axiata Limited',
  'Lalitpur',
  'NPR 40,000 - 60,000',
  'Create visually compelling designs for digital and print media. Work closely with the marketing team on brand identity projects.',
  'Email: talent@ncell.axiata.com | Portal: careers.ncell.com',
  'Design',
  'Full-Time'
),
(
  'Accountant',
  'Standard Chartered Bank Nepal',
  'Kathmandu',
  'NPR 50,000 - 75,000',
  'Manage financial records, prepare reports, and ensure compliance with banking regulations. Strong analytical skills required.',
  'Email: hr.nepal@sc.com | Apply: standardchartered.com/np/careers',
  'Finance',
  'Full-Time'
),
(
  'Customer Service Representative',
  'eSewa Fonepay',
  'Kathmandu',
  'NPR 25,000 - 35,000',
  'Handle customer inquiries and provide excellent support for our digital payment platform. Fresh graduates are welcome.',
  'Email: careers@esewa.com.np | Phone: 01-5970111',
  'Customer Service',
  'Full-Time'
),
(
  'Civil Engineer (Site)',
  'Kalika Construction',
  'Pokhara',
  'NPR 45,000 - 65,000',
  'Supervise construction projects and ensure quality standards are met. Travel to project sites required.',
  'Email: hr@kalikaconstruction.com | Phone: 061-525252',
  'Engineering',
  'Full-Time'
),
(
  'English Teacher',
  'Little Angels School',
  'Hattiban, Lalitpur',
  'NPR 30,000 - 45,000',
  'Teach English language and literature to secondary level students. Must have B.Ed or equivalent qualification.',
  'Email: principal@littleangels.edu.np | Phone: 01-5540000',
  'Education',
  'Full-Time'
),
(
  'Content Writer (Remote)',
  'TechSathi Nepal',
  'Remote',
  'NPR 20,000 - 35,000',
  'Write engaging tech content, reviews, and tutorials for our popular technology news portal. Passion for technology required.',
  'Email: editor@techsathi.com',
  'Media',
  'Remote'
),
(
  'HR Executive',
  'Chaudhary Group',
  'Kathmandu',
  'NPR 35,000 - 55,000',
  'Support HR operations including recruitment, onboarding, and employee relations for one of Nepal''''s largest conglomerates.',
  'Email: careers@cg.com.np | Portal: cg.com.np/careers',
  'Human Resources',
  'Full-Time'
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
