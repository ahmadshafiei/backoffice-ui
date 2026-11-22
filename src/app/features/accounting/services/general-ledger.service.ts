import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralLedgerFilters, GeneralLedgerItem, GeneralLedgerSummary } from '../models/general-ledger.model';
import { PagedResult } from '../models/paged-result.model';

const SUMMARY = '/api/v1/ledgers/general/summary';
const ITEMS = '/api/v1/ledgers/general/items';

/** General ledger (دفتر کل) summary and paged lines. */
@Injectable({ providedIn: 'root' })
export class GeneralLedgerService {
  private readonly http = inject(HttpClient);

  summary(filters: GeneralLedgerFilters): Observable<GeneralLedgerSummary> {
    return this.http.get<GeneralLedgerSummary>(SUMMARY, { params: toParams(filters) });
  }

  items(filters: GeneralLedgerFilters, page: { pageNumber: number; pageSize: number }): Observable<PagedResult<GeneralLedgerItem>> {
    const params = toParams(filters).set('pageNumber', page.pageNumber).set('pageSize', page.pageSize);
    return this.http.get<PagedResult<GeneralLedgerItem>>(ITEMS, { params });
  }
}

/** Query names match the ledger API (`AccountId`, `StartDate`, `EndDate`, `branchId`). */
function toParams(filters: GeneralLedgerFilters): HttpParams {
  let params = new HttpParams()
    .set('AccountId', filters.accountId)
    .set('StartDate', filters.startDate)
    .set('EndDate', filters.endDate);
  if (filters.branchId != null) params = params.set('branchId', filters.branchId);
  return params;
}
