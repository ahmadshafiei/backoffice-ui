import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { NotificationApi } from '../services/notification-api';

/** Prefixes relative URLs with the API base URL and surfaces failures as toasts. */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationApi);
  const auth = inject(AuthStore);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          auth.logout();
          void router.navigate(['/auth/login']);
        } else {
          notify.error(describeHttpError(error));
        }
      }
      return throwError(() => error);
    }),
  );
};

/** Turns an HTTP failure (ASP.NET ProblemDetails or not) into a user-facing Farsi message. */
export function describeHttpError(error: HttpErrorResponse): string {
  if (error.status === 0) return 'ارتباط با سرور برقرار نشد. اتصال شبکه را بررسی کنید.';

  const body = error.error as { message?: string | null; code?: number | null } | string | null;
  
  const fromBody = typeof body === 'string' ? body : (body?.message);
  
  if (fromBody) return fromBody;
  
  switch (error.status) {
    case 400: return 'درخواست نامعتبر است.';
    case 403: return 'شما به این بخش دسترسی ندارید.';
    case 404: return 'مورد درخواستی پیدا نشد.';
    case 409: return 'این عملیات با وضعیت فعلی داده‌ها تداخل دارد.';
    default: return error.status >= 500 ? 'خطای داخلی سرور. دوباره تلاش کنید.' : 'عملیات انجام نشد.';
  }
}
