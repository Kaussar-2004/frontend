// job-portal-frontend/src/app/app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app.component.styles.scss']
})
export class AppComponent {
  title = 'SkillLink';
  showNavigation = false;
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide navigation on role-selection page
      this.showNavigation = !event.url.includes('/role-selection');
    });
  }
}
