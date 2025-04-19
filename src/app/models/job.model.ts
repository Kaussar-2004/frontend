export interface Job {
  id?: number;
  job_title: string;
  company_name: string;
  location: string;
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary_range?: string;
  job_description: string;
  application_deadline: string;
  created_at?: string;
}