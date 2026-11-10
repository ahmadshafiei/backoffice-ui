import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldBase } from './field-base';

@Component({
  selector: 'app-toggle-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="toggle" [class.is-disabled]="disabled()">
      <input type="checkbox" role="switch" [checked]="!!value()" [disabled]="disabled()"
        (change)="onToggle($event)" (blur)="onTouched()" />
      <span class="track" aria-hidden="true"></span>
      <span class="toggle-label">{{ label() }}</span>
    </label>
    @if (hint()) { <p class="msg hint toggle-hint">{{ hint() }}</p> }
  `,
})
export class ToggleField extends FieldBase<boolean> {
  protected onToggle(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    this.value.set(next);
    this.onChange(next);
  }
}
