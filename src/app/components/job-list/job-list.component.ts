// job-portal-frontend/src/app/components/job-list/job-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = [
    'job_title', 'company_name', 'location', 'job_type', 
    'salary_range', 'application_deadline', 'actions'
  ];
  isLoading = true;
  isEmployer = false;

  constructor(
    private jobService: JobService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isEmployer = this.authService.isEmployer();
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching jobs', error);
        this.snackBar.open('Failed to load jobs', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  deleteJob(id: number): void {
    // Only employers can delete jobs
    if (!this.isEmployer) {
      this.snackBar.open('Only employers can delete jobs', 'Close', {
        duration: 3000
      });
      return;
    }

    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== id);
          this.snackBar.open('Job deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting job', error);
          this.snackBar.open('Failed to delete job', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  switchRole(): void {
    this.authService.clearUserRole();
  }
}