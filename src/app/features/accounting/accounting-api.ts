import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, expand, map, reduce, shareReplay, takeWhile, tap } from 'rxjs';
import {
  Account, AccountLevel, AccountingSettings, CreateDetailClassRequest, DetailClass, ModifyAccountRequest, PagedResult,
  RegisterAccountRequest, UpdateAccountingSettingsRequest,
} from './accounting.model';
import { environment } from '../../../environments/environment';

const ACCOUNTS = '/api/v1/accounts';
const DETAIL_CLASSES = '/api/v1/detail-classes';
const SETTINGS = '/api/v1/accounting-settings';

/** Thin typed wrapper over the Accounting WebApi (base URL is added by the API interceptor). */
@Injectable({ providedIn: 'root' })
export class AccountingApi {
  private readonly http = inject(HttpClient);

  /** `allAccounts` results, one entry per level, so pages that need parents share one fetch. */
  private readonly allAccountsCache = new Map<AccountLevel, Observable<Account[]>>();

  /* ---- Accounts (group / general / subsidiary share one resource) ---- */

  listAccounts(
    query: { accountLevel: AccountLevel; pageNumber: number; pageSize: number; name?: string },
  ): Observable<PagedResult<Account>> {
    let params = new HttpParams()
      .set('AccountLevel', query.accountLevel)
      .set('PageNumber', query.pageNumber)
      .set('PageSize', query.pageSize);
    if (query.name) params = params.set('Name', query.name);
    return this.http.get<PagedResult<Account>>(environment.projectionBaseUrl + ACCOUNTS, { params });
  }

  /**
   * Every account of one level (used for parent pickers): walk the pages until all rows are in.
   */
  listAllAccounts(accountLevel: AccountLevel, pageSize = 200): Observable<Account[]> {
    return this.listAccounts({ accountLevel, pageNumber: 1, pageSize }).pipe(
      expand((res, index) =>
        (index + 1) * pageSize < Number(res.totalCount) && res.items.length > 0
          ? this.listAccounts({ accountLevel, pageNumber: index + 2, pageSize })
          : [],
      ),
      takeWhile((res) => res.items.length > 0, true),
      map((res) => res.items),
      reduce((all, items) => [...all, ...items], [] as Account[]),
      map((all) => [...new Map(all.map((a) => [a.id, a])).values()]),
    );
  }

  /**
   * Every account of one level, shared and cached until the next mutation. Use this for parent
   * lookups instead of `listAllAccounts` directly, so opening several pages costs one request.
   */
  allAccounts(accountLevel: AccountLevel): Observable<Account[]> {
    let cached = this.allAccountsCache.get(accountLevel);
    if (!cached) {
      cached = this.listAllAccounts(accountLevel).pipe(
        tap({ error: () => this.allAccountsCache.delete(accountLevel) }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
      this.allAccountsCache.set(accountLevel, cached);
    }
    return cached;
  }

  /** A create / edit / delete can change any level, so the cached level lists are dropped. */
  private invalidateAllAccounts(): void {
    this.allAccountsCache.clear();
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${environment.projectionBaseUrl}${ACCOUNTS}/${id}`);
  }

  registerAccount(body: RegisterAccountRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}${ACCOUNTS}`, body).pipe(tap(() => this.invalidateAllAccounts()));
  }

  modifyAccount(id: string, body: ModifyAccountRequest): Observable<void> {
    return this.http.patch<void>(`${environment.apiBaseUrl}${ACCOUNTS}/${id}`, body).pipe(tap(() => this.invalidateAllAccounts()));
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}${ACCOUNTS}/${id}`).pipe(tap(() => this.invalidateAllAccounts()));
  }

  /* ---- Detail classes ---- */

  listDetailClasses(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<DetailClass>> {
    const params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    return this.http.get<PagedResult<DetailClass>>(`${environment.projectionBaseUrl}${DETAIL_CLASSES}`, { params });
  }

  createDetailClass(body: CreateDetailClassRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}${DETAIL_CLASSES}`, body);
  }

  deleteDetailClass(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}${DETAIL_CLASSES}/${id}`);
  }

  /* ---- Settings (code lengths) ---- */

  getSettings(): Observable<AccountingSettings> {
    return this.http.get<AccountingSettings>(`${environment.apiBaseUrl}${SETTINGS}`);
  }

  setSettings(body: UpdateAccountingSettingsRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}${SETTINGS}`, body);
  }
}
