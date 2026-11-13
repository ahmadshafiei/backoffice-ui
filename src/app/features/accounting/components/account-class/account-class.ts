import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { DataTable, TableCell, TableColumn } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { AccountingApi } from '../../accounting-api';
import { AccountClass, DetailClass } from '../../accounting.model';

type Selection = ReadonlyMap<string, ReadonlySet<string>>;

/**
 * Account ↔ detail-class links (ارتباط معین با طبقه تفصیلی).
 *
 * Rows come from `GET /account-classes`; every detail class is one column, and each cell is a
 * checkbox that grants the row's `accountId` the column's `detailClassId`. Saving PUTs one body
 * per changed account with its full set of detail class ids.
 */
@Component({
  selector: 'app-account-class',
  imports: [PageHeader, Icon, DataTable, TableCell, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-class.html',
  styleUrl: './account-class.css',
})
export class AccountClassPage {
  private readonly api = inject(AccountingApi);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly AccountClass[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly detailClasses = signal<readonly DetailClass[]>([]);

  /** Checkbox state as returned by the server, used to detect what the user changed. */
  private readonly saved = signal<Selection>(new Map());
  /** Checkbox state currently shown in the table. */
  private readonly draft = signal<Selection>(new Map());

  protected readonly rowKey = (row: AccountClass): string => row.accountId;

  protected readonly columns = computed<TableColumn<AccountClass>[]>(() => [
    { key: 'accountName', header: 'نام حساب', width: '260px' },
    ...this.detailClasses().map((detailClass) => ({ key: detailClass.id, header: detailClass.name })),
  ]);

  protected readonly changedRows = computed(() => {
    const draft = this.draft();
    const saved = this.saved();
    return this.rows().filter((row) => !sameSet(draft.get(row.accountId), saved.get(row.accountId)));
  });

  protected readonly hasChanges = computed(() => this.changedRows().length > 0);

  constructor() {
    // Server-side paging: refetch whenever page or page size changes.
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(pageNumber, pageSize));
    });

    void this.loadDetailClasses();
  }

  private async loadDetailClasses(): Promise<void> {
    try {
      this.detailClasses.set(await firstValueFrom(this.api.listAllDetailClasses()));
    } catch {
      /* surfaced by the interceptor */
    }
  }

  private async load(pageNumber: number, pageSize: number): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.api.listAccountClasses({ pageNumber, pageSize }));
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
      const selection = new Map(res.items.map((row) => [row.accountId, toSet(row.detailClassesId)] as const));
      this.saved.set(selection);
      this.draft.set(selection);
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected isChecked(accountId: string, detailClassId: string): boolean {
    return this.draft().get(accountId)?.has(detailClassId) ?? false;
  }

  protected toggle(accountId: string, detailClassId: string): void {
    this.draft.update((current) => {
      const next = new Map(current);
      const ids = new Set(next.get(accountId) ?? []);
      if (ids.has(detailClassId)) ids.delete(detailClassId);
      else ids.add(detailClassId);
      next.set(accountId, ids);
      return next;
    });
  }

  protected resetChanges(): void {
    this.draft.set(this.saved());
  }

  protected async save(): Promise<void> {
    const changed = this.changedRows();
    if (changed.length === 0) return;

    const draft = this.draft();
    this.saving.set(true);
    try {
      for (const row of changed) {
        await firstValueFrom(
          this.api.assignAccountClasses({
            accountId: row.accountId,
            detailClassesId: [...(draft.get(row.accountId) ?? [])],
          }),
        );
      }
      this.notify.success('ارتباط حساب با طبقه‌های تفصیلی ذخیره شد.');
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

function sameSet(a: ReadonlySet<string> | undefined, b: ReadonlySet<string> | undefined): boolean {
  const left = a ?? new Set<string>();
  const right = b ?? new Set<string>();
  if (left.size !== right.size) return false;
  for (const id of left) if (!right.has(id)) return false;
  return true;
}
