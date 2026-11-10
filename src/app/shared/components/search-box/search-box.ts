import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-search-box',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="search">
      <app-icon name="search" [size]="16" />
      <input type="search" [value]="value()" [placeholder]="placeholder()" [attr.aria-label]="placeholder()"
        (input)="value.set($any($event.target).value)" />
    </label>
  `,
  styles: `
    .search {
      display: flex; align-items: center; gap: 8px; height: 36px; min-width: 240px; padding: 0 10px;
      border: 1px solid var(--line-strong); border-radius: var(--radius-control); background: var(--surface);
      color: var(--ink-3);
    }
    .search:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 22%, transparent); }
    input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--ink); }
    input::placeholder { color: var(--ink-3); }
    @media (max-width: 640px) { .search { min-width: 0; width: 100%; } }
  `,
})
export class SearchBox {
  readonly value = model('');
  readonly placeholder = input('جستجو');
}
