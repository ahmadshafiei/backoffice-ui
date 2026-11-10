# بک‌آفیس کارگزاری (Angular 22)

```bash
npm install
npm start          # http://localhost:4200  (API: http://localhost:5169 – see src/environments)
npm test           # Vitest
npm run build      # production build
```

ساختار: `core/` (auth, layout, interceptors, services) · `features/` (accounting) · `shared/` (table, menu, modal, fields, datepicker, pipes, utils).

## Dev stubs / known gaps
- `core/auth/auth-store.ts` – the swagger has no auth endpoints; `login()` is a stub that accepts any non-empty credentials.
- `core/layout/footer` – fiscal year is derived from the current Jalali year until «تنظیم سال مالی جاری» has an API.
- `accounting/accounts-store.ts` – `GET /accounts` has no level filter, so the whole chart of accounts is loaded and filtered client-side.
- `detail-accounts`, `account-class`, `fiscal-year` – no endpoints in the swagger; they show the «coming soon» page.
- Menu entries other than accounting use the same placeholder page.
