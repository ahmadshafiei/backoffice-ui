import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Journal, PagedJournals, SaveJournalRequest } from '../models/journal.model';

const JOURNALS = '/api/v1/journals';

/** Typed wrapper over the journal (اسناد حسابداری) endpoints. */
@Injectable({ providedIn: 'root' })
export class JournalService {
  private readonly http = inject(HttpClient);

  list(query: { pageNumber: number; pageSize: number }): Observable<PagedJournals> {
    const params = new HttpParams().set('pageNumber', query.pageNumber).set('pageSize', query.pageSize);
    return this.http.get<PagedJournals>(JOURNALS, { params });
  }

  get(id: string): Observable<Journal> {
    return this.http.get<Journal>(`${JOURNALS}/${id}`);
  }

  create(body: SaveJournalRequest): Observable<void> {
    return this.http.post<void>(JOURNALS, body);
  }

  update(id: string, body: SaveJournalRequest): Observable<void> {
    return this.http.patch<void>(`${JOURNALS}/${id}`, body);
  }

  /** Finalises (قطعی میکند) a draft journal. Posted journals cannot be posted twice. */
  post(id: string): Observable<void> {
    return this.http.patch<void>(`${JOURNALS}/${id}/post`, null);
  }
}
