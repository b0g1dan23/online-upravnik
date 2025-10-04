import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { RedirectionGuard } from './guards/redirection.guard';
import { UserRoleEnum } from './store/user/user.model';

export const routes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
}, {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [RedirectionGuard]
},
{
    path: '',
    loadComponent: () => import('./components/app-layout/app-layout').then(m => m.AppLayout),
    children: [
        {
            path: 'tenant',
            canActivate: [RoleGuard],
            data: { role: UserRoleEnum.TENANT },
            loadComponent: () => import('./pages/tenant/tenant').then(m => m.Tenant),
        },
        {
            path: 'employee',
            canActivate: [RoleGuard],
            data: { role: UserRoleEnum.EMPLOYEE },
            loadComponent: () => import('./pages/employee/employee').then(m => m.Employee),
        },
        {
            path: 'manager',
            canActivate: [RoleGuard],
            data: { role: UserRoleEnum.MANAGER },
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
        }
    ]
},
{
    path: '**',
    redirectTo: 'login',
}];
