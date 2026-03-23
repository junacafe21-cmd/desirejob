// ============================================================
// Supabase Types
// ============================================================

export type JobType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote' | 'Internship';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  contact_info: string;
  category: string;
  job_type: JobType;
  is_active: boolean;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  cv_url?: string;
  payment_screenshot_url?: string;
  status: ApplicationStatus;
  admin_note?: string;
  credited: boolean;
  created_at: string;
  updated_at: string;
  job?: Job;
}

export interface Payment {
  id: string;
  application_id?: string;
  user_email: string;
  amount: number;
  credits_added: number;
  verified: boolean;
  verified_at?: string;
  created_at: string;
}

export interface UserCredits {
  id: string;
  email: string;
  credits: number;
  total_paid: number;
  created_at: string;
  updated_at: string;
}

export interface CV {
  id: string;
  user_email: string;
  data_json: CVData;
  created_at: string;
  updated_at: string;
}

export interface CVData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    objective: string;
  };
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export const JOB_CATEGORIES = [
  'Technology',
  'Marketing',
  'Finance',
  'Engineering',
  'Education',
  'Healthcare',
  'Operations',
  'Human Resources',
  'Design',
  'Customer Service',
  'Sales',
  'Media',
  'Legal',
  'Hospitality',
  'General',
];

export const NEPAL_LOCATIONS = [
  'Kathmandu',
  'Lalitpur',
  'Bhaktapur',
  'Pokhara',
  'Chitwan',
  'Butwal',
  'Biratnagar',
  'Birgunj',
  'Dharan',
  'Hetauda',
  'Remote',
  'All Districts',
];
