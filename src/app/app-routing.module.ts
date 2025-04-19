// job-portal-frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobApplicationFormComponent } from './components/job-application-form/job-application-form.component';
import { JobApplicationsListComponent } from './components/job-applications-list/job-applications-list.component';
import { RoleSelectionComponent } from './components/role-selection/role-selection.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'role-selection', pathMatch: 'full' },
  { path: 'role-selection', component: RoleSelectionComponent },
  {
    path: 'jobs',
    component: JobListComponent,
    canActivate: [RoleGuard],
    data: { requiredRole: 'any' }
  },
  {
    path: 'jobs/new',
    component: JobFormComponent,
    canActivate: [RoleGuard],
    data: { requiredRole: 'employer' }
  },
  {
    path: 'jobs/edit/:id',
    component: JobFormComponent,
    canActivate: [RoleGuard],
    data: { requiredRole: 'employer' }
  },
  {
    path: 'jobs/:id',
    component: JobDetailsComponent,
    canActivate: [RoleGuard],
    data: { requiredRole: 'any' }
  },
  {
    path: 'jobs/:id/apply',
    component: JobApplicationFormComponent,
    canActivate: [RoleGuard],
    data: { requiredRole: 'applicant' }
  },
  {
    path: 'applications',
    component: JobApplicationsListComponent,
    canActivate: [RoleGuard],
    data: { requiredRole: 'employer' }
  },
  { path: '**', redirectTo: '/role-selection' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
