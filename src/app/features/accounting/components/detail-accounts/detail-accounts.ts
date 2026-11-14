import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { SelectField, SelectOption } from '../../../../shared/components/fields/select-field';
import { TextField } from '../../../../shared/components/fields/text-field';
import { ToggleField } from '../../../../shared/components/fields/toggle-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { DetailAccount } from '../../models/detail-account.model';
import { DetailClass } from '../../models/detail-class.model';
import { DetailAccountService } from '../../services/detail-account.service';
import { DetailClassService } from '../../services/detail-class.service';

/**
 * Detail accounts (حساب‌های تفصیلی).
 *
 * Rows are paged on the server. Every row belongs to a detail class, so the create / edit dialog
 * fills its dropdown from `GET /detail-classes?pageNumber=1&pageSize=-1`.
 */
@Component({
  selector: 'app-detail-accounts',
  imports: [
    ReactiveFormsModule,
    PageHeader,
    Icon,
    DataTable,
    TableCell,
    TableRowActions,
    Modal,
    TextField,
    SelectField,
    ToggleField,
    ConfirmDialog,
    FaNumberPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-accounts.html',
  styleUrl: '../accounts/list-page.css',
})
export class DetailAccountsPage {
  private readonly detailAccounts = inject(DetailAccountService);
  private readonly detailClassesApi = inject(DetailClassService);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly DetailAccount[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly formOpen = signal(false);
  protected readonly editing = signal<DetailAccount | null>(null);
  protected readonly deleteOpen = signal(false);
  protected readonly deleting = signal<DetailAccount | null>(null);
  protected readonly busy = signal(false);

  protected readonly detailClasses = signal<readonly DetailClass[]>([]);
  protected readonly detailClassOptions = computed<readonly SelectOption[]>(() =>
    this.detailClasses().map((detailClass) => ({
      value: detailClass.id,
      label: `${detailClass.name} (${detailClass.detailClassCode})`,
    })),
  );

  private readonly detailClassNames = computed(
    () => new Map(this.detailClasses().map((detailClass) => [detailClass.id, detailClass.name] as const)),
  );

  protected readonly rowKey = (row: DetailAccount): string => row.id;
  protected readonly columns: TableColumn<DetailAccount>[] = [
    { key: 'accountCode', header: 'کد', width: '160px' },
    { key: 'accountName', header: 'نام' },
    { key: 'detailClassId', header: 'طبقه تفصیلی' },
    { key: 'canBeUsedAsParty', header: 'طرف حساب', width: '120px' },
    { key: 'isActive', header: 'وضعیت', width: '120px' },
  ];

  protected readonly form = new FormGroup({
    accountCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+$/)],
    }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    detailClassId: new FormControl<string | null>(null, Validators.required),
    isActive: new FormControl(true, { nonNullable: true }),
    canBeUsedAsParty: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    void this.loadDetailClasses();

    // Server-side paging: refetch whenever page or page size changes.
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(pageNumber, pageSize));
    });
  }

  protected detailClassName(id: string): string {
    return this.detailClassNames().get(id) ?? '—';
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
      const res = await firstValueFrom(this.detailAccounts.list({ pageNumber, pageSize }));
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ accountCode: '', name: '', detailClassId: null, isActive: true, canBeUsedAsParty: false });
    this.form.controls.accountCode.enable({ emitEvent: false });
    if (this.detailClasses().length === 0) void this.loadDetailClasses();
    this.formOpen.set(true);
  }

  protected openEdit(row: DetailAccount): void {
    this.editing.set(row);
    this.form.reset(
      {
        accountCode: row.accountCode,
        name: row.accountName,
        detailClassId: row.detailClassId,
        isActive: row.isActive,
        canBeUsedAsParty: row.canBeUsedAsParty,
      },
      { emitEvent: false },
    );
    this.form.controls.accountCode.disable({ emitEvent: false });
    this.formOpen.set(true);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const name = value.name.trim();
    const detailClassId = value.detailClassId as string;
    const row = this.editing();

    this.busy.set(true);
    try {
      if (row) {
        await firstValueFrom(
          this.detailAccounts.modify(row.id, {
            name,
            detailClassId,
            isActive: value.isActive,
            canBeUsedAsParty: value.canBeUsedAsParty,
          }),
        );
        this.notify.success('تغییرات ذخیره شد.');
      } else {
        await firstValueFrom(
          this.detailAccounts.register({
            name,
            accountCode: value.accountCode,
            detailClassId,
            isActive: value.isActive,
            canBeUsedAsParty: value.canBeUsedAsParty,
          }),
        );
        this.notify.success('حساب تفصیلی ایجاد شد.');
      }
      this.formOpen.set(false);
      await this.load(this.page(), this.pageSize());
    } catch {
      /* keep the dialog open so the input can be corrected */
    } finally {
      this.busy.set(false);
    }
  }

  protected askDelete(row: DetailAccount): void {
    this.deleting.set(row);
    this.deleteOpen.set(true);
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.detailAccounts.remove(row.id));
      this.notify.success(`«${row.accountName}» حذف شد.`);
      this.deleteOpen.set(false);
      if (this.rows().length === 1 && this.page() > 1) this.page.update((p) => p - 1);
      else await this.load(this.page(), this.pageSize());
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.busy.set(false);
    }
  }
}
