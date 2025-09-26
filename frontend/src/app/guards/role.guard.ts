import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, catchError, filter, firstValueFrom, map, of, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const expectedRole = route.data['role'];

        return this.authService.getCurrentUser().pipe(
            map(user => {
                console.log('Expected role:', expectedRole, 'User role:', user?.role);

                if (!user) {
                    console.log('No user, redirecting to login');
                    this.router.navigate(['/login']);
                    return false;
                }

                if (user.role !== expectedRole) {
                    console.log('Role mismatch, redirecting to login');
                    this.router.navigate(['/login']);
                    return false;
                }

                return true;
            })
        );
    }
}