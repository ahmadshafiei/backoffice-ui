import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AccountingSettings, UpdateAccountingSettingsRequest } from '../models/accounting-settings.model';

const SETTINGS = '/api/v1/accounting-settings';

/** Code length per account level (تنظیم حساب‌ها). */
@Injectable({ providedIn: 'root' })
export class AccountingSettingsService {
  private readonly http = inject(HttpClient);

  get(): Observable<AccountingSettings> {
    return this.http.get<AccountingSettings>(`${SETTINGS}`);
  }

  update(body: UpdateAccountingSettingsRequest): Observable<void> {
    return this.http.put<void>(`${SETTINGS}`, body);
  }
}
