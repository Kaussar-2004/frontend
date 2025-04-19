// job-portal-frontend/src/app/components/job-applications-list/job-applications-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application.service';

@Component({
  standalone: false,
  selector: 'app-job-applications-list',
  templateUrl: './job-applications-list.component.html',
  styleUrls: ['./job-applications-list.component.scss']
})
export class JobApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns: string[] = [
    'id', 'applicant_name', 'email', 'job_title', 'company_name', 'applied_at'
  ];
  isLoading = true;

  constructor(
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching applications', error);
        this.snackBar.open('Failed to load applications', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
}
