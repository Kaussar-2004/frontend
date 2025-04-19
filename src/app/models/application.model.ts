export interface Application {
  id?: number;
  job_id: number;
  applicant_name: string;
  email: string;
  applied_at?: string;
  job_title?: string;
  company_name?: string;
}