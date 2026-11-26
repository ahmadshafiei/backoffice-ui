import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LedgerFilters, LedgerItem, LedgerSummary } from '../models/ledger.model';
import { PagedResult } from '../models/paged-result.model';

const SUMMARY = '/api/v1/ledgers/summary';
const ITEMS = '/api/v1/ledgers/items';

/** Ledger (دفتر کل، معین، تفصیلی) summary and paged lines. */
@Injectable({ providedIn: 'root' })
export class LedgerService {
  private readonly http = inject(HttpClient);

  summary(filters: LedgerFilters): Observable<LedgerSummary> {
    return this.http.get<LedgerSummary>(SUMMARY, { params: toParams(filters) });
  }

  items(filters: LedgerFilters, page: { pageNumber: number; pageSize: number }): Observable<PagedResult<LedgerItem>> {
    const params = toParams(filters).set('pageNumber', page.pageNumber).set('pageSize', page.pageSize);
    return this.http.get<PagedResult<LedgerItem>>(ITEMS, { params });
  }
}

/** Query names match the ledger API (`AccountId`, `StartDate`, `EndDate`, `branchId`, `Level`). */
function toParams(filters: LedgerFilters): HttpParams {
  let params = new HttpParams()
    .set('AccountId', filters.accountId)
    .set('StartDate', filters.startDate)
    .set('EndDate', filters.endDate)
    .set('Level', filters.level);
  if (filters.branchId != null) params = params.set('branchId', filters.branchId);
  return params;
}