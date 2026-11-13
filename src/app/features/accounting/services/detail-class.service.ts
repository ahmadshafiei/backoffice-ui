import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateDetailClassRequest, DetailClass } from '../models/detail-class.model';
import { PAGE_SIZE_ALL, PagedResult } from '../models/paged-result.model';

const DETAIL_CLASSES = '/api/v1/detail-classes';

@Injectable({ providedIn: 'root' })
export class DetailClassService {
  private readonly http = inject(HttpClient);

  list(query: { pageNumber: number; pageSize: number }): Observable<PagedResult<DetailClass>> {
    const params = new HttpParams().set('PageNumber', query.pageNumber).set('PageSize', query.pageSize);
    return this.http.get<PagedResult<DetailClass>>(`${environment.projectionBaseUrl}${DETAIL_CLASSES}`, { params });
  }

  /** Every detail class in a single call (`pageSize = -1`). */
  all(): Observable<DetailClass[]> {
    return this.list({ pageNumber: 1, pageSize: PAGE_SIZE_ALL }).pipe(map((res) => res.items ?? []));
  }

  create(body: CreateDetailClassRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}${DETAIL_CLASSES}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}${DETAIL_CLASSES}/${id}`);
  }
}
