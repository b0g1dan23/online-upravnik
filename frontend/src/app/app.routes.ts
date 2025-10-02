import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { RedirectionGuard } from './guards/redirection.guard';
import { UserRoleEnum } from './store/user/user.model';

export const routes: Routes = [{
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
}, {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [RedirectionGuard]
}, {
    path: 'homepage',
    loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage),
}, {
    path: 'tenant',
    loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage),
    canActivate: [RoleGuard],
    data: {
        role: UserRoleEnum.TENANT
    }
}, {
    path: 'manager',
    loadComponent: () => import('./pages/manager/manager-layout/manager-layout').then(m => m.ManagerLayout),
    canActivate: [RoleGuard],
    data: {
        role: UserRoleEnum.MANAGER
    },
    children: [
        {
            path: '',
            loadComponent: () => import('./pages/manager/manager').then(m => m.Manager),
        },
        {
            path: 'employees',
            loadComponent: () => import('./pages/manager/employees/employees').then(m => m.Employees),
        },
        {
            path: 'buildings',
            loadComponent: () => import('./pages/manager/buildings/buildings').then(m => m.Buildings),
        }
    ]
}, {
    path: 'employee',
    loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage),
    canActivate: [RoleGuard],
    data: {
        role: UserRoleEnum.EMPLOYEE
    }
}];
