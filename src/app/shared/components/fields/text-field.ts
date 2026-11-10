import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { toEnDigits } from '../../utils/digits.utils';
import { FieldBase } from './field-base';

@Component({
  selector: 'app-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field" [class.invalid]="!!error()">
      @if (label()) {
        <label class="label" [attr.for]="id">{{ label() }}@if (required()) {<span class="req" aria-hidden="true"> *</span>}</label>
      }
      <input class="control" [class.ltr]="ltr()" [id]="id" [type]="type()" [value]="value() ?? ''"
        [disabled]="disabled()" [attr.placeholder]="placeholder() || null" [attr.maxlength]="maxlength()"
        [attr.inputmode]="inputmode() || null" [attr.dir]="ltr() ? 'ltr' : null" autocomplete="off"
        [attr.aria-invalid]="error() ? 'true' : null" [attr.aria-required]="required() ? 'true' : null"
        [attr.aria-describedby]="describedBy()" (input)="onInput($event)" (blur)="onTouched()" />
      @if (error()) {
        <p class="msg error" [id]="id + '-msg'" role="alert">{{ error() }}</p>
      } @else if (hint()) {
        <p class="msg hint" [id]="id + '-msg'">{{ hint() }}</p>
      }
    </div>
  `,
})
export class TextField extends FieldBase<string> {
  readonly type = input<'text' | 'password' | 'search'>('text');
  readonly placeholder = input('');
  readonly maxlength = input<number | null>(null);
  readonly inputmode = input<'text' | 'numeric' | 'search' | ''>('');
  /** Render left-to-right (codes, usernames, numbers). */
  readonly ltr = input(false);
  /** Convert Persian/Arabic digits to Latin as the user types (for codes and numbers). */
  readonly latinDigits = input(false);

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    let next = el.value;
    if (this.latinDigits()) {
      const converted = toEnDigits(next);
      if (converted !== next) { el.value = converted; next = converted; }
    }
    this.value.set(next);
    this.onChange(next);
  }
}
