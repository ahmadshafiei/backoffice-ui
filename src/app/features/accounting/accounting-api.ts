import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, expand, map, reduce, takeWhile } from 'rxjs';
import {
  Account, AccountingSettings, CreateDetailClassRequest, DetailClass, ModifyAccountRequest, PagedResult,
  RegisterAccountRequest, UpdateAccountingSettingsRequest,
} from './accounting.model';

const ACCOUNTS = '/api/v1/accounts';
const DETAIL_CLASSES = '/api/v1/detail-classes';

/** Thin typed wrapper over the Accounting WebApi (base URL is added by the API interceptor). */
@Injectable({ providedIn: 'root' })
export class AccountingApi {
  private readonly http = inject(HttpClient);

  /* ---- Accounts (group / general / subsidiary share one resource) ---- */

  listAccounts(query: { pageNumber: number; pageSize: number; name?: string }): Observable<PagedResult<Account>> {
    let params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    if (query.name) params = params.set('Name', query.name);
    return this.http.get<PagedResult<Account>>(ACCOUNTS, { params });
  }

  /**
   * The endpoint has no level filter, so the UI needs the whole chart of accounts: walk the pages
   * until every row is in. A chart of accounts is small (hundreds of rows), so this is cheap.
   */
  listAllAccounts(pageSize = 200): Observable<Account[]> {
    return this.listAccounts({ pageNumber: 1, pageSize }).pipe(
      expand((res, index) =>
        (index + 1) * pageSize < Number(res.totalCount) && res.items.length > 0
          ? this.listAccounts({ pageNumber: index + 2, pageSize })
          : [],
      ),
      takeWhile((res) => res.items.length > 0, true),
      map((res) => res.items),
      reduce((all, items) => [...all, ...items], [] as Account[]),
      map((all) => [...new Map(all.map((a) => [a.id, a])).values()]),
    );
  }

  getAccount(id: string): Observable<Account> {
    return this.http.get<Account>(`${ACCOUNTS}/${id}`);
  }

  registerAccount(body: RegisterAccountRequest): Observable<void> {
    return this.http.post<void>(ACCOUNTS, body);
  }

  modifyAccount(id: string, body: ModifyAccountRequest): Observable<void> {
    return this.http.patch<void>(`${ACCOUNTS}/${id}`, body);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${ACCOUNTS}/${id}`);
  }

  /* ---- Detail classes ---- */

  listDetailClasses(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<DetailClass>> {
    const params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    return this.http.get<PagedResult<DetailClass>>(DETAIL_CLASSES, { params });
  }

  createDetailClass(body: CreateDetailClassRequest): Observable<void> {
    return this.http.post<void>(DETAIL_CLASSES, body);
  }

  deleteDetailClass(id: string): Observable<void> {
    return this.http.delete<void>(`${DETAIL_CLASSES}/${id}`);
  }

  /* ---- Settings (code lengths) ---- */

  getSettings(): Observable<AccountingSettings> {
    return this.http.get<AccountingSettings>('/api/v1/accounting-settings');
  }

  setSettings(body: UpdateAccountingSettingsRequest): Observable<void> {
    return this.http.put<void>('/api/v1/accounting-settings', body);
  }
}
