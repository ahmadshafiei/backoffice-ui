import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Account, AccountLevel, ModifyAccountRequest, RegisterAccountRequest } from '../models/account.model';
import { PAGE_SIZE_ALL, PagedResult } from '../models/paged-result.model';

const ACCOUNTS = '/api/v1/accounts';

/** Accounts of every level (group / general / subsidiary) – one resource on the server. */
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  /** `all` results, one entry per level, so the parent pickers share one request. */
  private readonly allCache = new Map<AccountLevel, Observable<Account[]>>();

  list(query: { accountLevel: AccountLevel; pageNumber: number; pageSize: number; name?: string }): Observable<PagedResult<Account>> {
    let params = new HttpParams()
      .set('AccountLevel', query.accountLevel)
      .set('PageNumber', query.pageNumber)
      .set('PageSize', query.pageSize);
    if (query.name) params = params.set('Name', query.name);
    return this.http.get<PagedResult<Account>>(ACCOUNTS, { params });
  }

  /** Every account of one level in a single call (`pageSize = -1`), cached until the next mutation. */
  all(accountLevel: AccountLevel): Observable<Account[]> {
    let cached = this.allCache.get(accountLevel);
    if (!cached) {
      cached = this.list({ accountLevel, pageNumber: 1, pageSize: PAGE_SIZE_ALL }).pipe(
        map((res) => res.items ?? []),
        tap({ error: () => this.allCache.delete(accountLevel) }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
      this.allCache.set(accountLevel, cached);
    }
    return cached;
  }

  get(id: string): Observable<Account> {
    return this.http.get<Account>(`${ACCOUNTS}/${id}`);
  }

  register(body: RegisterAccountRequest): Observable<void> {
    return this.http.post<void>(`${ACCOUNTS}`, body).pipe(tap(() => this.allCache.clear()));
  }

  modify(id: string, body: ModifyAccountRequest): Observable<void> {
    return this.http.patch<void>(`${ACCOUNTS}/${id}`, body).pipe(tap(() => this.allCache.clear()));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${ACCOUNTS}/${id}`).pipe(tap(() => this.allCache.clear()));
  }
}
