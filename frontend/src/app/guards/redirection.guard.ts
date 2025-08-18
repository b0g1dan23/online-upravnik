import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService, UserRoleEnum } from "../services/auth";

@Injectable({
    providedIn: 'root'
})
export class RedirectionGuard implements CanActivate {
    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(): boolean {
        const role = this.authService.getRole();
        if (!role) return true;

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
        }
        return false;
    }
}