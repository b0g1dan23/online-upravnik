import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { Button } from "../../ui/button/button";

@Component({
  selector: 'app-tenant-navbar',
  imports: [Button],
  templateUrl: './tenant-navbar.html',
})
export class TenantNavbar {
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
