import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, inject, input, signal } from '@angular/core';
import { FaNumberPipe } from '../../pipes/fa-number';
import { toEnDigits } from '../../utils/digits.utils';
import {
  JALALI_MONTHS, JALALI_WEEKDAYS_SHORT, JalaliDate, formatJalali, jalaliMonthLength, jalaliWeekday,
  parseJalali, toGregorian, toJalali,
} from '../../utils/jalali.utils';
import { FieldBase } from '../fields/field-base';
import { Icon } from '../icon/icon';

/**
 * Jalali (Persian) date picker. The form value is a Gregorian ISO date string (`YYYY-MM-DD`) –
 * what APIs expect – while the user sees and types Jalali dates (`1405/08/18`).
 */
@Component({
  selector: 'app-datepicker',
  imports: [Icon, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
})
export class Datepicker extends FieldBase<string> {
  readonly placeholder = input('۱۴۰۵/۰۱/۰۱');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly months = JALALI_MONTHS;
  protected readonly weekdays = JALALI_WEEKDAYS_SHORT;
  protected readonly isOpen = signal(false);
  protected readonly text = signal('');
  protected readonly view = signal<{ jy: number; jm: number }>(this.today());

  protected readonly selected = computed<JalaliDate | null>(() => {
    const iso = this.value();
    return iso ? toJalali(fromIso(iso)) : null;
  });

  protected readonly cells = computed<(number | null)[]>(() => {
    const { jy, jm } = this.view();
    const lead = jalaliWeekday(toGregorian({ jy, jm, jd: 1 }));
    const days = Array.from({ length: jalaliMonthLength(jy, jm) }, (_, i) => i + 1);
    return [...Array<null>(lead).fill(null), ...days];
  });

  override writeValue(value: string | null): void {
    super.writeValue(value);
    this.localError.set('');
    this.text.set(value ? formatJalali(toJalali(fromIso(value))) : '');
    if (value) this.view.set(this.viewOf(toJalali(fromIso(value))));
  }

  protected isSelected(day: number): boolean {
    const s = this.selected(); const v = this.view();
    return !!s && s.jy === v.jy && s.jm === v.jm && s.jd === day;
  }

  protected isToday(day: number): boolean {
    const t = toJalali(new Date()); const v = this.view();
    return t.jy === v.jy && t.jm === v.jm && t.jd === day;
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const raw = toEnDigits(el.value);
    this.text.set(raw);
    if (raw.trim() === '') {
      this.localError.set('');
      this.commit(null);
      return;
    }
    const parsed = parseJalali(raw);
    if (parsed) {
      this.localError.set('');
      this.view.set(this.viewOf(parsed));
      this.commit(toIso(toGregorian(parsed)));
    } else {
      this.commit(null);
    }
  }

  protected onBlur(): void {
    const raw = this.text().trim();
    if (raw !== '' && !parseJalali(raw)) this.localError.set('تاریخ را به شکل ۱۴۰۵/۰۱/۰۱ وارد کنید.');
    this.onTouched();
  }

  protected pick(day: number): void {
    const { jy, jm } = this.view();
    const picked = { jy, jm, jd: day };
    this.localError.set('');
    this.text.set(formatJalali(picked));
    this.commit(toIso(toGregorian(picked)));
    this.isOpen.set(false);
    this.onTouched();
  }

  protected goToday(): void {
    const t = toJalali(new Date());
    this.view.set(this.viewOf(t));
    this.pick(t.jd);
  }

  protected shiftMonth(delta: number): void {
    this.view.update(({ jy, jm }) => {
      const index = jy * 12 + (jm - 1) + delta;
      return { jy: Math.floor(index / 12), jm: (index % 12) + 1 };
    });
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update((o) => !o);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) this.isOpen.set(false);
  }

  @HostListener('keydown.escape')
  protected onEscape(): void { this.isOpen.set(false); }

  private commit(iso: string | null): void {
    this.value.set(iso);
    this.onChange(iso);
  }

  private today(): { jy: number; jm: number } { return this.viewOf(toJalali(new Date())); }
  private viewOf(d: JalaliDate): { jy: number; jm: number } { return { jy: d.jy, jm: d.jm }; }
}

function fromIso(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toIso(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
