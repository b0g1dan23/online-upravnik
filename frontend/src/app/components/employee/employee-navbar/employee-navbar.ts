import { Component, inject } from '@angular/core';
import { Button } from "../../ui/button/button";
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-navbar',
  imports: [Button],
  templateUrl: './employee-navbar.html',
})
export class EmployeeNavbar {
  currentURL: string;
  private readonly authService = inject(AuthService);

  constructor(private router: Router) {
    this.currentURL = this.router.url;
    this.router.events.subscribe(() => {
      this.currentURL = this.router.url;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
