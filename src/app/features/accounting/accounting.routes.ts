import { Routes } from '@angular/router';

/**
 * `detail-accounts` and `account-class` have no endpoints in the current swagger, so they show the
 * shared «coming soon» page until the API is available.
 */
const comingSoon = () => import('../../core/pages/coming-soon/coming-soon').then((m) => m.ComingSoon);

export const ACCOUNTING_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'group-accounts' },
  { path: 'group-accounts', title: 'گروه حساب‌های کل', loadComponent: () => import('./pages/group-accounts/group-accounts').then((m) => m.GroupAccounts) },
  { path: 'general-accounts', title: 'حساب‌های کل', loadComponent: () => import('./pages/general-accounts/general-accounts').then((m) => m.GeneralAccounts) },
  { path: 'subsidiary-accounts', title: 'حساب‌های معین', loadComponent: () => import('./pages/subsidiary-accounts/subsidiary-accounts').then((m) => m.SubsidiaryAccounts) },
  { path: 'detail-class', title: 'طبقه تفصیلی', loadComponent: () => import('./components/detail-class/detail-class').then((m) => m.DetailClassPage) },
  { path: 'detail-accounts', title: 'حساب‌های تفصیلی', loadComponent: comingSoon },
  { path: 'account-class', title: 'ارتباط معین با تفصیلی', loadComponent: comingSoon },
  { path: 'fiscal-year', title: 'تنظیم سال مالی جاری', loadComponent: comingSoon },
];
