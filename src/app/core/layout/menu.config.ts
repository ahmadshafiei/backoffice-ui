import { MenuGroup } from '../../shared/components/menu/menu.model';

/** Single source of truth for the main menu. Paths are `/<section>/<page>`. */
export const MENU: readonly MenuGroup[] = [
  {
    id: 'system', label: 'راهبری سیستم', icon: 'settings-2',
    children: [
      { label: 'کاربران', path: '/system/users' },
      { label: 'گروه‌های کاربری', path: '/system/user-groups' },
      { label: 'شعب و باجه‌ها', path: '/system/branches' },
      { label: 'شرکت کارگزاری', path: '/system/brokerage-company' },
      { label: 'تقویم کاری', path: '/system/work-calendar' },
      { label: 'تنظیم پارامترها', path: '/system/parameters' },
      { label: 'تنظیم حساب‌ها', path: '/system/account-settings' },
    ],
  },
  {
    id: 'base', label: 'اطلاعات پایه', icon: 'database',
    children: [
      { label: 'مشتریان', path: '/base/customers' },
      { label: 'گروه‌های مشتریان', path: '/base/customer-groups' },
      { label: 'درخواست‌های دریافت کد بورس', path: '/base/exchange-code-requests' },
      { label: 'حساب‌های بانکی مشتریان', path: '/base/customer-bank-accounts' },
      { label: 'ضرایب مشتریان', path: '/base/customer-coefficients' },
      { label: 'اوراق بهادار', path: '/base/securities' },
      { label: 'آمار قیمت اوراق بهادار', path: '/base/securities-prices' },
      { label: 'بانک‌ها', path: '/base/banks' },
      { label: 'حساب‌های بانکی', path: '/base/bank-accounts' },
      { label: 'صندوق‌ها', path: '/base/funds' },
    ],
  },
  {
    id: 'requests', label: 'درخواست', icon: 'file-text',
    children: [
      { label: 'درخواست‌های خرید', path: '/requests/buy-requests' },
      { label: 'درخواست‌های فروش', path: '/requests/sell-requests' },
      { label: 'مدیریت درخواست', path: '/requests/request-management' },
      { label: 'فایل‌های معاملات', path: '/requests/trade-files' },
      { label: 'پردازش معاملات', path: '/requests/trade-processing' },
      { label: 'آمار درخواست‌های امضاءنشده', path: '/requests/unsigned-requests-stats' },
    ],
  },
  { id: 'online-trading', label: 'معاملات برخط', icon: 'activity', path: '/online-trading' },
  {
    id: 'payments', label: 'دریافت و پرداخت', icon: 'wallet',
    children: [
      { label: 'دریافت‌ها', path: '/payments/receipts' },
      { label: 'پرداخت‌ها', path: '/payments/payments' },
      { label: 'درخواست‌های پرداخت وجه', path: '/payments/payment-requests' },
      { label: 'پیگیری حواله', path: '/payments/remittance-tracking' },
    ],
  },
  {
    id: 'accounting', label: 'حسابداری', icon: 'calculator',
    children: [
      { label: 'تنظیم سال مالی جاری', path: '/accounting/fiscal-year' },
      { label: 'گروه حساب‌های کل', path: '/accounting/group-accounts' },
      { label: 'حساب‌های کل', path: '/accounting/general-accounts' },
      { label: 'حساب‌های معین', path: '/accounting/subsidiary-accounts' },
      { label: 'حساب‌های تفصیلی', path: '/accounting/detail-accounts' },
      { label: 'طبقه تفصیلی', path: '/accounting/detail-class' },
      { label: 'ارتباط معین با تفصیلی', path: '/accounting/account-class' },
    ],
  },
  {
    id: 'reports', label: 'گزارش‌ها', icon: 'chart-column',
    children: [
      { label: 'گردش حساب مشتری', path: '/reports/customer-ledger' },
      { label: 'وضعیت مالی مشتریان', path: '/reports/customer-financial-status' },
      { label: 'وضعیت دارایی مشتریان', path: '/reports/customer-assets-status' },
      { label: 'صورت دارایی مشتری', path: '/reports/customer-asset-statement' },
      { label: 'خلاصه معاملات', path: '/reports/trades-summary' },
      { label: 'ریز معاملات مشتری', path: '/reports/customer-trade-details' },
      { label: 'وضعیت خرید اعتباری مشتریان', path: '/reports/credit-purchase-status' },
      { label: 'اخطارهای اعتباری', path: '/reports/credit-alerts' },
      { label: 'کنترل حساب بانکی مشتریان', path: '/reports/customer-bank-account-control' },
      { label: 'پیشگیری از کسری وجوه کارگزاری', path: '/reports/brokerage-shortfall-prevention' },
      { label: 'فایل بورس', path: '/reports/exchange-file' },
    ],
  },
];

/** Finds the menu label for a URL (used by placeholder pages and the document title). */
export function menuLabelFor(url: string): string | null {
  const path = url.split(/[?#]/)[0];
  for (const group of MENU) {
    if (group.path === path) return group.label;
    const leaf = group.children?.find((c) => c.path === path);
    if (leaf) return leaf.label;
  }
  return null;
}
