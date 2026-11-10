import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, timer } from 'rxjs';
import { JalaliDatePipe } from '../../../shared/pipes/date-pipe';
import { FaNumberPipe } from '../../../shared/pipes/fa-number';
import { toJalali } from '../../../shared/utils/jalali.utils';

@Component({
  selector: 'app-footer',
  imports: [JalaliDatePipe, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <span>سال مالی جاری: <strong>{{ fiscalYear() | faNumber: false }}</strong></span>
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

  /**
   * Placeholder: the current fiscal year is the Jalali calendar year. Replace with the value from
   * «تنظیم سال مالی جاری» once that API exists.
   */
  protected readonly fiscalYear = computed(() => toJalali(this.now()).jy);
}
