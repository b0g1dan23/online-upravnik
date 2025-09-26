import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService, UserRoleEnum } from "../services/auth";
import { Observable, map, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RedirectionGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        return this.authService.getCurrentUser().pipe(
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