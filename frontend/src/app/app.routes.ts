import { Routes } from '@angular/router';
import { UserRoleEnum } from './services/auth';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [{
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
}, {
    path: '',
    loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage),
    canActivate: [RoleGuard],
    data: {
        role: UserRoleEnum.TENANT
    }
}];
