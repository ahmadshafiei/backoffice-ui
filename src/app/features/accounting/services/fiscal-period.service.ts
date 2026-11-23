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

  getActive(): Observable<FiscalPeriod> {
    return this.http.get<FiscalPeriod>(`${FISCAL_PERIODS}/active`);
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

  activate(period: FiscalPeriod, isActive: boolean): Observable<void> {
    const { name, startDate, endDate } = period;
    return this.http.put<void>(`${FISCAL_PERIODS}/${period.id}`, { name, startDate, endDate, isActive });
  }
}
