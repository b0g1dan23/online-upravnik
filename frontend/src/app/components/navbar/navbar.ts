import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from "../ui/button/button";
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Button],
  templateUrl: './navbar.html',
})
export class Navbar {
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
