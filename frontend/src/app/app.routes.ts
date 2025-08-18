import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { UserRoleEnum } from './services/auth';
import { RedirectionGuard } from './guards/redirection.guard';

export const routes: Routes = [{
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [RedirectionGuard]
}, {
    path: '',
    loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage),
}, {
    path: 'tenant',
    loadComponent: () => import('./pages/tenant/tenant').then(m => m.Tenant),
    canActivate: [RoleGuard],
    data: {
        role: UserRoleEnum.TENANT
    }
}];
