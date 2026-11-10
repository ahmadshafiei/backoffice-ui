import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { FieldBase } from './field-base';

export interface SelectOption<T = string | number> { value: T; label: string }

@Component({
  selector: 'app-select-field',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field" [class.invalid]="!!error()">
      @if (label()) {
        <label class="label" [attr.for]="id">{{ label() }}@if (required()) {<span class="req" aria-hidden="true"> *</span>}</label>
      }
      <div class="select-wrap">
        <select class="control" [id]="id" [disabled]="disabled()" [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-required]="required() ? 'true' : null" [attr.aria-describedby]="describedBy()"
          (change)="onSelect($event)" (blur)="onTouched()">
          <option value="" [selected]="value() === null">{{ placeholder() }}</option>
          @for (option of options(); track option.value) {
            <option [value]="$index" [selected]="option.value === value()">{{ option.label }}</option>
          }
        </select>
        <app-icon class="chevron" name="chevron-down" [size]="16" />
      </div>
      @if (error()) {
        <p class="msg error" [id]="id + '-msg'" role="alert">{{ error() }}</p>
      } @else if (hint()) {
        <p class="msg hint" [id]="id + '-msg'">{{ hint() }}</p>
      }
    </div>
  `,
})
export class SelectField extends FieldBase<string | number> {
  readonly options = input<readonly SelectOption[]>([]);
  readonly placeholder = input('انتخاب کنید');

  protected onSelect(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const next = raw === '' ? null : (this.options()[Number(raw)]?.value ?? null);
    this.value.set(next);
    this.onChange(next);
  }
}
