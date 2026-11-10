import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, computed, contentChild, contentChildren, inject, input, model } from '@angular/core';
import { FaNumberPipe } from '../../pipes/fa-number';
import { pageCount } from '../../utils/array.utils';
import { EmptyState } from '../empty-state/empty-state';
import { Icon } from '../icon/icon';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  width?: string;
  /** Plain-text accessor; defaults to row[key]. For rich cells use an `appCell` template instead. */
  value?: (row: T) => string | number | null | undefined;
}

/** <ng-template appCell="status" let-row> … </ng-template> overrides the cell of column `status`. */
@Directive({ selector: 'ng-template[appCell]' })
export class TableCell {
  readonly key = input.required<string>({ alias: 'appCell' });
  readonly template = inject(TemplateRef);
}

/** <ng-template appRowActions let-row> … </ng-template> renders the last (actions) column. */
@Directive({ selector: 'ng-template[appRowActions]' })
export class TableRowActions {
  readonly template = inject(TemplateRef);
}

/**
 * Presentational table with built-in pagination. The parent owns the data: pass the rows of the
 * *current page* plus `total`, and react to `page` / `pageSize` changes (server- or client-side).
 */
@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet, Icon, FaNumberPipe, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T extends object = any> {
  readonly columns = input.required<readonly TableColumn<T>[]>();
  readonly rows = input<readonly T[]>([]);
  readonly total = input(0);
  readonly loading = input(false);
  readonly rowKey = input<(row: T) => unknown>((row) => row);
  readonly emptyTitle = input('موردی برای نمایش وجود ندارد');
  readonly emptyMessage = input('');
  readonly pageSizeOptions = input<readonly number[]>([10, 20, 50]);
  readonly caption = input('');

  /** 1-based page number. */
  readonly page = model(1);
  readonly pageSize = model(10);

  private readonly cells = contentChildren(TableCell);
  protected readonly actions = contentChild(TableRowActions);

  protected readonly cellMap = computed(() => new Map(this.cells().map((c) => [c.key(), c.template])));
  protected readonly totalPages = computed(() => pageCount(this.total(), this.pageSize()));
  protected readonly from = computed(() => (this.total() === 0 ? 0 : (this.page() - 1) * this.pageSize() + 1));
  protected readonly to = computed(() => Math.min(this.total(), this.page() * this.pageSize()));
  protected readonly skeleton = computed(() => Array.from({ length: Math.min(this.pageSize(), 6) }, (_, i) => i));
  protected readonly colCount = computed(() => this.columns().length + (this.actions() ? 1 : 0));

  /** 1 … 4 5 [6] 7 8 … 20 – `null` entries are ellipses. */
  protected readonly pages = computed<(number | null)[]>(() => {
    const last = this.totalPages();
    const current = Math.min(this.page(), last);
    const wanted = new Set([1, last, current - 1, current, current + 1]);
    const sorted = [...wanted].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
    const out: (number | null)[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
      out.push(p);
    });
    return out;
  });

  protected cellText(row: T, column: TableColumn<T>): string {
    const raw = column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
    return raw === null || raw === undefined || raw === '' ? '—' : String(raw);
  }

  protected goTo(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  protected setPageSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
  }
}
