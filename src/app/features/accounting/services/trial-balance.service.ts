import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TrialBalanceFilters } from '../components/trial-balance/trial-balance.model';
import { TrialBalanceApiItem } from '../models/trial-balance.model';
import { PagedResult } from '../models/paged-result.model';
import { FiscalPeriodService } from './fiscal-period.service';

const TRIAL_BALANCE = '/api/v1/trial-balances';

@Injectable({ providedIn: 'root' })
export class TrialBalanceService {
  private readonly http = inject(HttpClient);
  private readonly fiscalService = inject(FiscalPeriodService);

  items(filters: TrialBalanceFilters, page: { pageNumber: number; pageSize: number }): Observable<PagedResult<TrialBalanceApiItem>> {
    const activePeriod = this.fiscalService.activePeriod();
    let params = new HttpParams()
      .set('level', filters.level)
      .set('fiscalPeriodId', activePeriod?.id ?? '')
      .set('startDate', filters.startDate)
      .set('endDate', filters.endDate)
      .set('pageNumber', page.pageNumber)
      .set('pageSize', page.pageSize);
    if (filters.branchId != null) params = params.set('branchId', filters.branchId);
    return this.http.get<PagedResult<TrialBalanceApiItem>>(TRIAL_BALANCE, { params });
  }
}