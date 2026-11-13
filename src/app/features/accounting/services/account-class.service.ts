import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AccountClass, AssignAccountClassRequest } from '../models/account-class.model';
import { PagedResult } from '../models/paged-result.model';

const ACCOUNT_CLASSES = '/api/v1/account-classes';

/** Links between accounts and detail classes. */
@Injectable({ providedIn: 'root' })
export class AccountClassService {
  private readonly http = inject(HttpClient);

  list(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<AccountClass>> {
    const params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    return this.http
      .get<PagedResult<AccountClass>>(`${environment.projectionBaseUrl}${ACCOUNT_CLASSES}`, { params });
  }

  assign(body: AssignAccountClassRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}${ACCOUNT_CLASSES}`, body);
  }
}
