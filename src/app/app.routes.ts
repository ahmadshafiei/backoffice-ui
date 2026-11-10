import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { menuLabelFor } from './core/layout/menu.config';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./core/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'accounting/group-accounts' },
      { path: 'accounting', loadChildren: () => import('./features/accounting/accounting.routes').then((m) => m.ACCOUNTING_ROUTES) },
      {
        path: 'system/account-settings',
        title: 'تنظیم حساب‌ها',
        loadComponent: () => import('./features/accounting/components/account-settings/account-settings').then((m) => m.AccountSettingsPage),
      },
      // Menu entries that have no feature yet land on a placeholder instead of a 404.
      { path: 'online-trading', title: 'معاملات برخط', loadComponent: () => import('./core/pages/coming-soon/coming-soon').then((m) => m.ComingSoon) },
      { path: ':section/:page', title: (_route, state) => menuLabelFor(state.url) ?? 'صفحه', loadComponent: () => import('./core/pages/coming-soon/coming-soon').then((m) => m.ComingSoon) },
    ],
  },
  { path: '**', redirectTo: '' },
];
