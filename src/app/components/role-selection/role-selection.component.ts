import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
  standalone: false
})
export class RoleSelectionComponent {

  constructor(private router: Router, private authService: AuthService) {}

  selectRole(role: UserRole): void {
    this.authService.setUserRole(role);

    if (role === 'employer') {
      this.router.navigate(['/applications']); // Employer view
    } else {
      this.router.navigate(['/jobs']); // Applicant view
    }
  }
}
