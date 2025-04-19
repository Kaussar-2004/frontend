// job-portal-frontend/src/app/components/job-details/job-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  isLoading = true;
  jobId!: number;
  isEmployer = false;
  isApplicant = false;

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isEmployer = this.authService.isEmployer();
    this.isApplicant = this.authService.isApplicant();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jobId = +id;
        this.loadJobDetails(this.jobId);
      }
    });
  }

  loadJobDetails(id: number): void {
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: (data) => {
        this.job = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching job details', error);
        this.snackBar.open('Failed to load job details', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/jobs']);
      }
    });
  }

  deleteJob(): void {
    // Only employers can delete jobs
    if (!this.isEmployer) {
      this.snackBar.open('Only employers can delete jobs', 'Close', {
        duration: 3000
      });
      return;
    }
    
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(this.jobId).subscribe({
        next: () => {
          this.snackBar.open('Job deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/jobs']);
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