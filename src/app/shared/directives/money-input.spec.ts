import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toFaDigits } from '../utils/digits.utils';
import { MoneyInputDirective } from './money-input';

@Component({
  imports: [ReactiveFormsModule, MoneyInputDirective],
  template: `<input appMoneyInput [formControl]="amount" [moneyDecimals]="decimals" />`,
})
class Host {
  readonly amount = new FormControl<number | null>(null);
  decimals = 2;
}

function setup(value: number | null = null, decimals = 2) {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.decimals = decimals;
  fixture.componentInstance.amount.setValue(value);
  fixture.detectChanges();
  const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
  return { fixture, input, control: fixture.componentInstance.amount };
}

function type(input: HTMLInputElement, text: string): void {
  input.value = text;
  input.setSelectionRange(text.length, text.length);
  input.dispatchEvent(new Event('input'));
}

describe('MoneyInputDirective', () => {
  it('renders the bound number grouped in Persian digits', () => {
    const { input, control } = setup(1234567);

    expect(input.value).toBe(toFaDigits('1٬234٬567'));
    expect(control.value).toBe(1234567);
  });

  it('groups while typing and keeps the model numeric', () => {
    const { fixture, input, control } = setup();

    type(input, '1234');
    fixture.detectChanges();

    expect(input.value).toBe(toFaDigits('1٬234'));
    expect(control.value).toBe(1234);
  });

  it('accepts Persian and Arabic-Indic digits and grouping separators', () => {
    const { input, control } = setup();

    type(input, toFaDigits('1٬234٬567'));
    expect(input.value).toBe(toFaDigits('1٬234٬567'));
    expect(control.value).toBe(1234567);

    type(input, '١٢٣٤');
    expect(input.value).toBe(toFaDigits('1٬234'));
    expect(control.value).toBe(1234);
  });

  it('clears the model when the input is emptied', () => {
    const { input, control } = setup(5000);

    type(input, '');
    expect(input.value).toBe('');
    expect(control.value).toBeNull();
  });

  it('respects the decimals limit', () => {
    const { input, control } = setup(null, 2);

    type(input, '1234.567');
    expect(input.value).toBe(toFaDigits('1٬234٫56'));
    expect(control.value).toBe(1234.56);
  });

  it('allows integers only when moneyDecimals is 0', () => {
    const { input, control } = setup(null, 0);

    type(input, '1234.56');
    expect(input.value).toBe(toFaDigits('1٬234'));
    expect(control.value).toBe(1234);
  });

  it('updates the display when the control changes from code', () => {
    const { fixture, input, control } = setup();

    control.setValue(98765);
    fixture.detectChanges();

    expect(input.value).toBe(toFaDigits('98٬765'));
  });

  it('marks the control as touched on blur', () => {
    const { input, control } = setup(1234);

    input.dispatchEvent(new Event('blur'));
    expect(control.touched).toBe(true);
  });
});
