// job-portal-frontend/src/app/components/job-form/job-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';

@Component({
  standalone: false,
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  jobForm!: FormGroup;
  isEditMode = false;
  jobId?: number;
  isLoading = false;
  todayDate = new Date();
  
  jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship'
  ];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.jobId = +id;
        this.loadJobDetails(this.jobId);
      }
    });
  }

  initForm(): void {
    this.jobForm = this.fb.group({
      job_title: ['', [Validators.required, Validators.maxLength(255)]],
      company_name: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      job_type: ['Full-time', Validators.required],
      salary_range: [''],
      job_description: ['', [Validators.required]],
      application_deadline: ['', [Validators.required]]
    });
  }

  loadJobDetails(id: number): void {
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        // Format the date for the date picker
        const deadline = new Date(job.application_deadline);
        job.application_deadline = deadline.toISOString().split('T')[0];
        
        this.jobForm.patchValue(job);
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
    if (this.jobForm.invalid) {
      return;
    }

    const jobData: Job = this.jobForm.value;
    this.isLoading = true;

    if (this.isEditMode && this.jobId) {
      this.jobService.updateJob(this.jobId, jobData).subscribe({
        next: () => {
          this.snackBar.open('Job updated successfully', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
          this.router.navigate(['/jobs']);
        },
        error: (error) => {
          console.error('Error updating job', error);
          this.snackBar.open('Failed to update job', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
    } else {
      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.snackBar.open('Job created successfully', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
          this.router.navigate(['/jobs']);
        },
        error: (error) => {
          console.error('Error creating job', error);
          this.snackBar.open('Failed to create job', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
    }
  }
}