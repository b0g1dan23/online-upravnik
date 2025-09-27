import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth";
import { Observable, map, take } from "rxjs";
import { UserRoleEnum } from "../store/user/user.model";
import { Store } from "@ngrx/store";
import { selectUser } from "../store/user/user.selectors";

@Injectable({
    providedIn: 'root'
})
export class RedirectionGuard implements CanActivate {
    store = inject(Store);
    private user$ = this.store.select(selectUser);

    constructor(
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.user$.pipe(
            take(1),
            map(user => {
                if (!user) {
                    return true;
                }

                this.redirectByRole(user.role);
                return false;
            })
        );
    }

    private redirectByRole(role: UserRoleEnum): void {
        switch (role) {
            case UserRoleEnum.TENANT:
                this.router.navigate(['/tenant']);
                break;
            case UserRoleEnum.MANAGER:
                this.router.navigate(['/manager']);
                break;
            case UserRoleEnum.EMPLOYEE:
                this.router.navigate(['/employee']);
                break;
            default:
                this.router.navigate(['/homepage']);
        }
    }
}