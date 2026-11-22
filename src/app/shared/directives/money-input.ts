import { Directive, ElementRef, forwardRef, inject, input, numberAttribute } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatGroupedNumber, parseGroupedNumber } from '../utils/number-format.utils';

/**
 * Groups the digits of a numeric `<input>` three from the right while typing (`۱۲۳۴۵۶۷` ->
 * `۱٬۲۳۴٬۵۶۷`) and hands the bound control a plain `number`.
 *
 * Works with `formControlName`, `formControl` and `ngModel`, and replaces the native value
 * accessor, so the formatted text never leaks into the model:
 *
 * ```html
 * <input appMoneyInput formControlName="amount" />
 * <input appMoneyInput [moneyDecimals]="0" formControlName="count" />   <!-- no decimals -->
 * ```
 */
@Directive({
  selector: 'input[appMoneyInput]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MoneyInputDirective), multi: true },
  ],
  host: {
    type: 'text',
    dir: 'ltr',
    inputmode: 'decimal',
    autocomplete: 'off',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
})
export class MoneyInputDirective implements ControlValueAccessor {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Fraction digits kept while typing; `0` allows integers only. */
  readonly decimals = input(2, { alias: 'moneyDecimals', transform: numberAttribute });

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | string | null | undefined): void {
    const input = this.el.nativeElement;
    const next = value === null || value === undefined || value === ''
      ? ''
      : formatGroupedNumber(value, this.decimals());
    if (input.value === next) return;
    // While the user is typing, Angular may write back the value we just emitted; keep their text
    // (and caret) when it already represents that number, e.g. a trailing "۰٫".
    if (
      input.ownerDocument.activeElement === input &&
      parseGroupedNumber(input.value) === parseGroupedNumber(String(value ?? ''))
    ) {
      return;
    }
    input.value = next;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  protected onInput(): void {
    const input = this.el.nativeElement;
    const significantBeforeCaret = this.significantBeforeCaret(input);
    input.value = formatGroupedNumber(input.value, this.decimals());
    this.moveCaret(input, significantBeforeCaret);
    this.onChange(parseGroupedNumber(input.value));
  }

  protected onBlur(): void {
    this.el.nativeElement.value = formatGroupedNumber(this.el.nativeElement.value, this.decimals());
    this.onTouched();
  }

  /** Digits (and decimal separators) to the left of the caret, so it survives re-grouping. */
  private significantBeforeCaret(input: HTMLInputElement): number {
    const caret = input.selectionStart ?? input.value.length;
    return input.value.slice(0, caret).replace(/[^\d.٫]/g, '').length;
  }

  private moveCaret(input: HTMLInputElement, significant: number): void {
    if (input.selectionStart === null) return;
    if (significant === 0) {
      input.setSelectionRange(0, 0);
      return;
    }
    let seen = 0;
    for (let index = 0; index < input.value.length; index++) {
      if (!/[\d.٫]/.test(input.value[index])) continue;
      if (++seen === significant) {
        input.setSelectionRange(index + 1, index + 1);
        return;
      }
    }
    input.setSelectionRange(input.value.length, input.value.length);
  }
}
