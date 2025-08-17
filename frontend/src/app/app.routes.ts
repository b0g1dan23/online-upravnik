import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
}];
