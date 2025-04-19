import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export type UserRole = 'applicant' | 'employer' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRoleSubject = new BehaviorSubject<UserRole>(this.getUserRole());
  public userRole$: Observable<UserRole> = this.userRoleSubject.asObservable();

  constructor(private router: Router) {
    // Check if role exists on service initialization
    if (!this.getUserRole()) {
      this.router.navigate(['/role-selection']);
    }
  }

  setUserRole(role: UserRole): void {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
    this.userRoleSubject.next(role);
  }

  getUserRole(): UserRole {
    const role = localStorage.getItem('userRole') as UserRole;
    return role;
  }

  isEmployer(): boolean {
    return this.getUserRole() === 'employer';
  }

  isApplicant(): boolean {
    return this.getUserRole() === 'applicant';
  }

  clearUserRole(): void {
    localStorage.removeItem('userRole');
    this.userRoleSubject.next(null);
    this.router.navigate(['/role-selection']);
  }
}