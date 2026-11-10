import { Injectable, computed, signal } from '@angular/core';
import { AuthUser, LoginRequest } from './auth.model';

const STORAGE_KEY = 'backoffice.auth.user';

/**
 * Holds the signed-in user.
 *
 * ⚠ DEV STUB: the Accounting swagger has no authentication endpoints, so `login()` accepts any
 * non-empty credentials and fabricates a user. Replace the body of `login()` with the real
 * identity-service call (and keep the signals/guard as they are).
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<AuthUser | null>(read());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  async login({ username, password }: LoginRequest): Promise<void> {
    if (!username.trim() || !password) throw new Error('نام کاربری و گذرواژه را وارد کنید.');
    const user: AuthUser = { id: 'dev-user', fullName: 'مدیر سیستم', role: 'مدیر ارشد' };
    this._user.set(user);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch { /* storage unavailable */ }
  }

  logout(): void {
    this._user.set(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }
}

function read(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
