import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'ورود',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
];
