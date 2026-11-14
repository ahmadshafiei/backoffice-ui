import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AccountClass, AssignAccountClassRequest } from '../models/account-class.model';
import { PagedResult } from '../models/paged-result.model';

const ACCOUNT_CLASSES = '/api/v1/account-classes';

@Injectable({ providedIn: 'root' })
export class AccountClassService {
  private readonly http = inject(HttpClient);

  /** `searchExp` matches an account name or code; the server ignores it until the query supports it. */
  list(query: { pageNumber: number; pageSize: number; searchExp?: string }): Observable<PagedResult<AccountClass>> {
    let params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    if (query.searchExp) params = params.set('searchExp', query.searchExp);
    return this.http
      .get<PagedResult<AccountClass>>('/api/v1/accounts/account-classes', { params });
  }

  assign(body: AssignAccountClassRequest): Observable<void> {
    return this.http.put<void>(`${ACCOUNT_CLASSES}`, body);
  }
}
