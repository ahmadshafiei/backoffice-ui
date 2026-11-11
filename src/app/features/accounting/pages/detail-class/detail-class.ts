import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { SelectField } from '../../../../shared/components/fields/select-field';
import { TextField } from '../../../../shared/components/fields/text-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { AccountingApi } from '../../accounting-api';
import { DetailClass, NORMAL_BALANCE_LABEL, NORMAL_BALANCE_OPTIONS, NormalBalance } from '../../accounting.model';

/** Detail classes (طبقه تفصیلی). The API supports list / create / delete – there is no update endpoint. */
@Component({
  selector: 'app-detail-class',
  imports: [ReactiveFormsModule, PageHeader, Icon, DataTable, TableCell, TableRowActions, Modal, TextField, SelectField, ConfirmDialog, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detail-class.html',
  styleUrl: '../../components/accounts/list-page.css'
})
export class DetailClassPage {
  private readonly api = inject(AccountingApi);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly DetailClass[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly formOpen = signal(false);
  protected readonly deleteOpen = signal(false);
  protected readonly deleting = signal<DetailClass | null>(null);
  protected readonly busy = signal(false);

  protected readonly balanceLabel = NORMAL_BALANCE_LABEL;
  protected readonly balanceOptions = NORMAL_BALANCE_OPTIONS;
  protected readonly rowKey = (row: DetailClass): string => row.id;
  protected readonly columns: TableColumn<DetailClass>[] = [
    { key: 'detailClassCode', header: 'کد طبقه', width: '160px' },
    { key: 'name', header: 'نام' },
    { key: 'normalBalance', header: 'ماهیت', width: '150px' },
  ];

  protected readonly form = new FormGroup({
    detailClassCode: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    normalBalance: new FormControl<NormalBalance | null>(null, Validators.required),
  });

  constructor() {
    // Server-side paging: refetch whenever page or page size changes.
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(pageNumber, pageSize));
    });
  }

  private async load(pageNumber: number, pageSize: number): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.api.listDetailClasses({ pageNumber, pageSize }));
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected openCreate(): void {
    this.form.reset({ detailClassCode: '', name: '', normalBalance: null });
    this.formOpen.set(true);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { detailClassCode, name, normalBalance } = this.form.getRawValue();
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.createDetailClass({ detailClassCode, name: name.trim(), normalBalance: normalBalance as NormalBalance }));
      this.notify.success('طبقه تفصیلی ایجاد شد.');
      this.formOpen.set(false);
      await this.load(this.page(), this.pageSize());
    } catch {
      /* keep the dialog open so the input can be corrected */
    } finally {
      this.busy.set(false);
    }
  }

  protected askDelete(row: DetailClass): void {
    this.deleting.set(row);
    this.deleteOpen.set(true);
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.deleteDetailClass(row.id));
      this.notify.success(`«${row.name}» حذف شد.`);
      this.deleteOpen.set(false);
      // Deleting the last row of the last page: step back one page (the effect reloads).
      if (this.rows().length === 1 && this.page() > 1) this.page.update((p) => p - 1);
      else await this.load(this.page(), this.pageSize());
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.busy.set(false);
    }
  }
}
