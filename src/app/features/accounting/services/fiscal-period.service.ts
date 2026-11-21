import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFiscalPeriodRequest, FiscalPeriod } from '../models/fiscal-period.model';
import { PagedResult } from '../models/paged-result.model';

const FISCAL_PERIODS = '/api/v1/fiscal-periods';

@Injectable({ providedIn: 'root' })
export class FiscalPeriodService {
  private readonly http = inject(HttpClient);

  list(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<FiscalPeriod>> {
    const params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
    return this.http.get<PagedResult<FiscalPeriod>>(FISCAL_PERIODS, { params });
  }

  get(id: string): Observable<FiscalPeriod> {
    return this.http.get<FiscalPeriod>(`${FISCAL_PERIODS}/${id}`);
  }

  create(body: CreateFiscalPeriodRequest): Observable<void> {
    return this.http.post<void>(FISCAL_PERIODS, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${FISCAL_PERIODS}/${id}`);
  }

  /**
   * ASSUMPTION: the PRD lists no endpoint for closing / activating a period. This assumes
   * `PUT /api/v1/fiscal-periods/{id}` taking the full body. Adjust here once the real endpoint is known.
   */
  setClosed(period: FiscalPeriod, isClosed: boolean): Observable<void> {
    const { name, startDate, endDate } = period;
    return this.http.put<void>(`${FISCAL_PERIODS}/${period.id}`, { name, startDate, endDate, isClosed });
  }
}
