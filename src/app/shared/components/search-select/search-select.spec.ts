import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { SearchSelect } from './search-select';

interface Item {
  id: string;
  name: string;
}

const ITEMS: readonly Item[] = [
  { id: 'a1', name: 'صندوق' },
  { id: 'a2', name: 'بانک' },
  { id: 'b1', name: 'بدهکاران' },
];

@Component({
  imports: [ReactiveFormsModule, SearchSelect],
  template: `
    <app-search-select
      label="حساب"
      placeholder="جستجو"
      [formControl]="control"
      [search]="search"
      [optionValue]="value"
      [optionLabel]="label"
      [resolveLabel]="resolve"
      [debounceMs]="0"
    />
  `,
})
class Host {
  readonly control = new FormControl<string | null>(null);
  readonly searchCalls: string[] = [];

  readonly search = (term: string): Observable<readonly Item[]> => {
    this.searchCalls.push(term);
    return of(ITEMS.filter((item) => item.name.includes(term)));
  };
  readonly value = (item: Item): string => item.id;
  readonly label = (item: Item): string => `${item.id} - ${item.name}`;
  readonly resolve = (id: string): Observable<string> => of(`resolved:${id}`);
}

async function render(): Promise<ReturnType<typeof TestBed.createComponent<Host>>> {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

function inputOf(fixture: ReturnType<typeof TestBed.createComponent<Host>>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

describe('SearchSelect', () => {
  it('searches on focus and renders the returned options', async () => {
    const fixture = await render();
    const input = inputOf(fixture);

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('[role="option"]');
    expect(fixture.componentInstance.searchCalls).toEqual(['']);
    expect(options.length).toBe(3);
    expect(options[0].textContent.trim()).toBe('a1 - صندوق');
  });

  it('debounces typed search and filters the options', async () => {
    const fixture = await render();
    const input = inputOf(fixture);

    input.dispatchEvent(new Event('focus'));
    input.value = 'بانک';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 5));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const options = [...fixture.nativeElement.querySelectorAll('[role="option"]')];
    expect(fixture.componentInstance.searchCalls.at(-1)).toBe('بانک');
    expect(options.map((option) => option.textContent.trim())).toEqual(['a2 - بانک']);
  });

  it('selects an option and writes its value to the form control', async () => {
    const fixture = await render();
    const input = inputOf(fixture);

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('[role="option"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('a1');
    expect(input.value).toBe('a1 - صندوق');
  });

  it('resolves the label of an externally assigned value', async () => {
    const fixture = await render();
    const input = inputOf(fixture);

    fixture.componentInstance.control.setValue('b1');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(input.value).toBe('resolved:b1');
  });

  it('disables the input with the form control', async () => {
    const fixture = await render();
    const input = inputOf(fixture);

    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });

  it('selects the highlighted option with the keyboard', async () => {
    const fixture = await render();
    const input = inputOf(fixture);

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('a1');
  });
});
