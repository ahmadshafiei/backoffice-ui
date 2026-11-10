import { DestroyRef, Directive, DoCheck, computed, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { fieldErrorMessage } from '../../utils/form.utils';

let nextId = 0;

/**
 * Shared plumbing for every form field in `shared`: ControlValueAccessor, disabled state, and
 * validation-message display (shown once the control is touched or dirty).
 */
@Directive()
export abstract class FieldBase<T> implements ControlValueAccessor, DoCheck {
  readonly label = input('');
  readonly hint = input('');
  /** Visual "required" marker only – add `Validators.required` on the control itself. */
  readonly required = input(false);
  /** Per-field overrides, e.g. { pattern: 'کد فقط شامل ارقام است.' }. */
  readonly messages = input<Record<string, string>>({});

  protected readonly ngControl = inject(NgControl, { self: true, optional: true });
  protected readonly destroyRef = inject(DestroyRef);

  readonly id = `field-${nextId++}`;
  protected readonly value = signal<T | null>(null);
  protected readonly disabled = signal(false);
  /** Field-local error (e.g. unparsable date) that takes priority over validator errors. */
  protected readonly localError = signal('');
  private readonly controlError = signal('');
  protected readonly error = computed(() => this.localError() || this.controlError());

  protected onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  ngDoCheck(): void {
    const control = this.ngControl?.control;
    const next = control && control.invalid && (control.touched || control.dirty)
      ? fieldErrorMessage(control.errors, this.messages())
      : '';
    if (next !== this.controlError()) this.controlError.set(next);
  }

  writeValue(value: T | null): void { this.value.set(value ?? null); }
  registerOnChange(fn: (value: T | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  protected describedBy(): string | null {
    return this.error() || this.hint() ? `${this.id}-msg` : null;
  }
}
