import { ChangeDetectionStrategy, Component, computed, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, timer } from 'rxjs';
import { JalaliDatePipe } from '../../../shared/pipes/date-pipe';
import { FiscalPeriodService } from '../../../features/accounting/services/fiscal-period.service';
import { FiscalPeriod } from '../../../features/accounting/models/fiscal-period.model';

@Component({
  selector: 'app-footer',
  imports: [JalaliDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <span>سال مالی جاری: <strong>{{ activeFiscalPeriod?.name }}</strong></span>
      <span class="clock">
        <time [attr.datetime]="now().toISOString()">{{ now() | jalaliDate: 'long' }}، ساعت {{ now() | jalaliDate: 'time' }}</time>
      </span>
    </footer>
  `,
  styles: `
    footer {
      height: var(--footer-h); display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-inline: 16px;
      background: var(--surface); border-top: 1px solid var(--line); color: var(--ink-2); font-size: 12.5px;
    }
    strong { color: var(--ink); font-variant-numeric: tabular-nums; }
    .clock { font-variant-numeric: tabular-nums; }
  `,
})
export class Footer {
  protected readonly now = toSignal(timer(0, 1000).pipe(map(() => new Date())), { initialValue: new Date() });
  private readonly periods = inject(FiscalPeriodService);

  constructor() {
    untracked(() => void this.load());
  }

  async load() {
    this.activeFiscalPeriod = await firstValueFrom(this.periods.getActive());
  }
  /**
   * Placeholder: the current fiscal year is the Jalali calendar year. Replace with the value from
   * «تنظیم سال مالی جاری» once that API exists.
   */
  protected activeFiscalPeriod: FiscalPeriod | null = null;
}
