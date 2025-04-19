// job-portal-frontend/src/app/components/job-application-form/job-application-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  standalone: false,
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.scss']
})
export class JobApplicationFormComponent implements OnInit {
  applicationForm!: FormGroup;
  job: Job | null = null;
  jobId!: number;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.jobId = +id;
        this.loadJobDetails(this.jobId);
      } else {
        this.router.navigate(['/jobs']);
      }
    });
  }

  initForm(): void {
    this.applicationForm = this.fb.group({
      applicant_name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]]
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

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const applicationData: Application = {
      job_id: this.jobId,
      ...this.applicationForm.value
    };

    this.applicationService.applyForJob(this.jobId, applicationData).subscribe({
      next: () => {
        this.snackBar.open('Application submitted successfully', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        console.error('Error submitting application', error);
        this.snackBar.open('Failed to submit application', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
}