import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { DataTable, TableCell, TableColumn } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { AccountClass } from '../../models/account-class.model';
import { DetailClass } from '../../models/detail-class.model';
import { AccountClassService } from '../../services/account-class.service';
import { DetailClassService } from '../../services/detail-class.service';

interface RowEdit {
  /** Selection the user wants to save. */
  ids: ReadonlySet<string>;
  /** Selection the server returned for this row, used to detect changes and to revert. */
  baseline: ReadonlySet<string>;
}

/**
 * Account <-> detail-class links.
 *
 * Rows come from `GET /account-classes` with server-side paging; the columns are the complete
 * list of detail classes (`pageSize = -1`). Every cell is a checkbox that grants the row's
 * `accountId` the column's `detailClassId`. Saving PUTs one body per changed account with its
 * full set of detail class ids.
 *
 * Edits are keyed by `accountId`, so checkboxes ticked on another page survive a page change.
 */
@Component({
  selector: 'app-account-class',
  imports: [PageHeader, Icon, DataTable, TableCell, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-class.html',
  styleUrl: './account-class.css',
})
export class AccountClassPage {
  private readonly accountClasses = inject(AccountClassService);
  private readonly detailClassesApi = inject(DetailClassService);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly AccountClass[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly detailClasses = signal<readonly DetailClass[]>([]);

  private readonly edits = signal<ReadonlyMap<string, RowEdit>>(new Map());

  protected readonly rowKey = (row: AccountClass): string => row.accountId;

  protected readonly columns = computed<TableColumn<AccountClass>[]>(() => [
    { key: 'accountName', header: 'نام حساب', width: '260px' },
    ...this.detailClasses().map((detailClass) => ({ key: detailClass.id, header: detailClass.name })),
  ]);

  private readonly changed = computed(() =>
    [...this.edits()].filter(([, edit]) => !sameSet(edit.ids, edit.baseline)),
  );

  protected readonly changedCount = computed(() => this.changed().length);
  protected readonly hasChanges = computed(() => this.changedCount() > 0);

  constructor() {
    void this.loadDetailClasses();

    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(pageNumber, pageSize));
    });
  }

  private async loadDetailClasses(): Promise<void> {
    try {
      this.detailClasses.set(await firstValueFrom(this.detailClassesApi.all()));
    } catch {
      /* surfaced by the interceptor */
    }
  }

  private async load(pageNumber: number, pageSize: number): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.accountClasses.list({ pageNumber, pageSize }));
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected isChecked(row: AccountClass, detailClassId: string): boolean {
    const edit = this.edits().get(row.accountId);
    if (edit) return edit.ids.has(detailClassId);
    return toSet(row.detailClassesId).has(detailClassId);
  }

  protected isDirty(row: AccountClass): boolean {
    const edit = this.edits().get(row.accountId);
    return !!edit && !sameSet(edit.ids, edit.baseline);
  }

  protected toggle(row: AccountClass, detailClassId: string): void {
    this.edits.update((current) => {
      const baseline = current.get(row.accountId)?.baseline ?? toSet(row.detailClassesId);
      const ids = new Set(current.get(row.accountId)?.ids ?? baseline);
      if (ids.has(detailClassId)) ids.delete(detailClassId);
      else ids.add(detailClassId);

      const next = new Map(current);
      if (sameSet(ids, baseline)) next.delete(row.accountId);
      else next.set(row.accountId, { ids, baseline });
      return next;
    });
  }

  protected resetChanges(): void {
    this.edits.set(new Map());
  }

  protected async save(): Promise<void> {
    const changed = this.changed();
    if (changed.length === 0) return;

    this.saving.set(true);
    try {
      for (const [accountId, edit] of changed) {
        await firstValueFrom(this.accountClasses.assign({ accountId, detailClassesId: [...edit.ids] }));
      }
      this.notify.success('ارتباط حساب با طبقه‌های تفصیلی ذخیره شد.');
      this.edits.set(new Map());
      await this.load(this.page(), this.pageSize());
    } catch {
      /* keep the checkboxes as they are so the user can retry */
    } finally {
      this.saving.set(false);
    }
  }
}

function toSet(ids: readonly string[] | null | undefined): ReadonlySet<string> {
  return new Set(ids ?? []);
}

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}
