import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { menuLabelFor } from '../../layout/menu.config';

/** Stand-in for menu entries whose feature has not been built yet. */
@Component({
  selector: 'app-coming-soon',
  imports: [PageHeader, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="title" />
    <div class="panel">
      <app-empty-state icon="hammer" title="این بخش در دست توسعه است"
        message="به‌زودی در دسترس خواهد بود. بخش حسابداری از منوی کناری قابل استفاده است." />
    </div>
  `,
  styles: `.panel { border: 1px solid var(--line); border-radius: var(--radius-panel); background: var(--surface); }`,
})
export class ComingSoon {
  protected readonly title = menuLabelFor(inject(Router).url) ?? 'صفحه';
}
