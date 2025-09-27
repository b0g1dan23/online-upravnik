import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/user/user.selectors';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    store = inject(Store);
    private user$ = this.store.select(selectUser);
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const expectedRole = route.data['role'];

        return this.user$.pipe(
            map(user => {
                if (!user) {
                    this.router.navigate(['/login']);
                    return false;
                }

                if (user.role !== expectedRole) {
                    this.router.navigate(['/login']);
                    return false;
                }

                return true;
            })
        );
    }
}