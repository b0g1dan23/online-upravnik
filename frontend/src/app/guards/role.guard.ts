import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole = route.data['role'];
        const userRole = this.authService.getRole();

        if (!userRole) {
            this.router.navigate(['/login']);
            return false;
        }

        if (userRole !== expectedRole) {
            this.router.navigate(['/login']);
            return false;
        }

        return true;
    }
}