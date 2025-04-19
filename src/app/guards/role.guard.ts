import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

// Extended type to include 'any' for route configuration
type RouteRole = UserRole | 'any';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['requiredRole'] as RouteRole;
    const userRole = this.authService.getUserRole();

    // If no role is required, allow access
    if (!requiredRole) {
      return true;
    }

    // If user has no role, redirect to role selection
    if (!userRole) {
      this.router.navigate(['/role-selection']);
      return false;
    }

    // If the route allows both roles
    if (requiredRole === 'any') {
      return true;
    }

    // If the route requires a specific role and user has that role, allow access
    if (requiredRole === userRole) {
      return true;
    }

    // Otherwise, redirect to appropriate page based on user's role
    if (userRole === 'employer') {
      this.router.navigate(['/applications']);
    } else {
      this.router.navigate(['/jobs']);
    }
    
    return false;
  }
}