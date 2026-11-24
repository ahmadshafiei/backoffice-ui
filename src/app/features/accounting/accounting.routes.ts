import { Routes } from '@angular/router';

export const ACCOUNTING_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'group-accounts' },
  { path: 'group-accounts', title: 'گروه حساب‌های کل', loadComponent: () => import('./pages/group-accounts/group-accounts').then((m) => m.GroupAccounts) },
  { path: 'general-accounts', title: 'حساب‌های کل', loadComponent: () => import('./pages/general-accounts/general-accounts').then((m) => m.GeneralAccounts) },
  { path: 'subsidiary-accounts', title: 'حساب‌های معین', loadComponent: () => import('./pages/subsidiary-accounts/subsidiary-accounts').then((m) => m.SubsidiaryAccounts) },
  { path: 'detail-class', title: 'طبقه تفصیلی', loadComponent: () => import('./components/detail-class/detail-class').then((m) => m.DetailClassPage) },
  { path: 'detail-accounts', title: 'حساب‌های تفصیلی', loadComponent: () => import('./pages/detail-accounts/detail-accounts').then((m) => m.DetailAccounts) },
  { path: 'account-class', title: 'ارتباط معین با طبقه تفصیلی', loadComponent: () => import('./components/account-class/account-class').then((m) => m.AccountClassPage) },
  { path: 'journals', title: 'اسناد حسابداری', loadComponent: () => import('./components/journals/journals').then((m) => m.JournalsPage) },
  { path: 'journals/new', title: 'سند جدید', loadComponent: () => import('./components/journals/journal-edit').then((m) => m.JournalEditPage) },
  { path: 'journals/:id', title: 'ویرایش سند', loadComponent: () => import('./components/journals/journal-edit').then((m) => m.JournalEditPage) },
  { path: 'general-ledger', title: 'دفتر کل', loadComponent: () => import('./components/ledgers/general-ledger/general-ledger-filter').then((m) => m.GeneralLedgerFilterPage) },
  { path: 'general-ledger/result', title: 'دفتر کل', loadComponent: () => import('./components/ledgers/general-ledger/general-ledger-result').then((m) => m.GeneralLedgerResultPage) },
  { path: 'fiscal-periods', title: 'تنظیم دوره مالی', loadComponent: () => import('./components/fiscal-period/fiscal-period').then((m) => m.FiscalPeriodPage) },
];
