import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreateFiscalPeriodRequest, FiscalPeriod } from '../models/fiscal-period.model';
import { PagedResult } from '../models/paged-result.model';

const FISCAL_PERIODS = '/api/v1/fiscal-periods';

@Injectable({ providedIn: 'root' })
export class FiscalPeriodService {

  private readonly http = inject(HttpClient);

  private readonly _activePeriod = signal<FiscalPeriod | null>(null);
  readonly activePeriod = this._activePeriod.asReadonly();

  list(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<FiscalPeriod>> {
    const params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
    return this.http.get<PagedResult<FiscalPeriod>>(FISCAL_PERIODS, { params });
  }

  getActive(): Observable<FiscalPeriod> {
    return this.http.get<FiscalPeriod>(`${FISCAL_PERIODS}/active`).pipe(
      tap((period) => this._activePeriod.set(period)),
    );
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

  activate(id: string, name: string): Observable<void> {
    return this.http.patch<void>(`${FISCAL_PERIODS}/${id}/activate`, {})
      .pipe(tap(() => this.getActive().subscribe()));
  }
}
