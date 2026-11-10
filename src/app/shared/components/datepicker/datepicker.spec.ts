import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Datepicker } from './datepicker';

@Component({
  imports: [ReactiveFormsModule, Datepicker],
  template: `<app-datepicker label="تاریخ" [formControl]="control" />`,
})
class Host {
  readonly control = new FormControl<string | null>('2026-11-10');
}

describe('Datepicker', () => {
  it('shows a Gregorian ISO value as a Jalali date, and parses typed input back', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('1405/08/19');

    input.value = '۱۴۰۵/۰۱/۰۱';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.control.value).toBe('2026-03-21');
  });

  it('picks a day from the calendar panel', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('.trigger') as HTMLButtonElement).click();
    await fixture.whenStable();
    const day = [...el.querySelectorAll<HTMLButtonElement>('.day')].find((b) => b.textContent?.trim() === '۲۰');
    day?.click();
    expect(fixture.componentInstance.control.value).toBe('2026-11-11');
  });
});
