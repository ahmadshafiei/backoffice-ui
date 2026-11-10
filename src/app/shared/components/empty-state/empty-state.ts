import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import { IconName } from '../icon/icons';

@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <span class="badge"><app-icon [name]="icon()" [size]="22" /></span>
      <h2>{{ title() }}</h2>
      @if (message()) { <p>{{ message() }}</p> }
      <div class="actions"><ng-content /></div>
    </div>
  `,
  styles: `
    .empty { display: grid; justify-items: center; gap: 6px; padding: 48px 24px; text-align: center; }
    .badge { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; margin-bottom: 8px;
      background: var(--surface-2); border: 1px solid var(--line); color: var(--ink-3); }
    h2 { font-size: 15px; font-weight: 600; }
    p { color: var(--ink-2); max-width: 44ch; }
    .actions:not(:empty) { margin-top: 12px; }
  `,
})
export class EmptyState {
  readonly icon = input<IconName>('inbox');
  readonly title = input.required<string>();
  readonly message = input('');
}
