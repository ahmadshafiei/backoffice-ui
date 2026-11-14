import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DetailAccount,
  ModifyDetailAccountRequest,
  RegisterDetailAccountRequest,
} from '../models/detail-account.model';
import { PagedResult } from '../models/paged-result.model';

const DETAIL_ACCOUNTS = '/api/v1/detail-accounts';

/** Detail accounts (حساب‌های تفصیلی) – each one belongs to a detail class. */
@Injectable({ providedIn: 'root' })
export class DetailAccountService {
  private readonly http = inject(HttpClient);

  list(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<DetailAccount>> {
    const params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    return this.http.get<PagedResult<DetailAccount>>(DETAIL_ACCOUNTS, { params });
  }

  get(id: string): Observable<DetailAccount> {
    return this.http.get<DetailAccount>(`${DETAIL_ACCOUNTS}/${id}`);
  }

  register(body: RegisterDetailAccountRequest): Observable<void> {
    return this.http.post<void>(DETAIL_ACCOUNTS, body);
  }

  modify(id: string, body: ModifyDetailAccountRequest): Observable<void> {
    return this.http.patch<void>(`${DETAIL_ACCOUNTS}/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${DETAIL_ACCOUNTS}/${id}`);
  }
}
