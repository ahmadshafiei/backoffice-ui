import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { TextField } from '../../../../shared/components/fields/text-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { Modal } from '../../../../shared/components/modal/modal';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { formatJalali, toJalali } from '../../../../shared/utils/jalali.utils';
import { FiscalPeriod, isValidPeriodRange } from '../../models/fiscal-period.model';
import { FiscalPeriodService } from '../../services/fiscal-period.service';

function rangeValidator(group: AbstractControl): ValidationErrors | null {
  const { startDate, endDate } = group.value as { startDate: string | null; endDate: string | null };
  if (!startDate || !endDate) return null;
  return isValidPeriodRange(startDate, endDate) ? null : { range: true };
}

@Component({
  selector: 'app-fiscal-period',
  imports: [ReactiveFormsModule, PageHeader, Icon, DataTable, TableCell, TableRowActions, Modal, TextField, Datepicker, ConfirmDialog, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fiscal-period.html',
  styleUrl: '../accounts/list-page.css'
})
export class FiscalPeriodPage {
  private readonly periods = inject(FiscalPeriodService);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly FiscalPeriod[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly formOpen = signal(false);
  protected readonly deleteOpen = signal(false);
  protected readonly deleting = signal<FiscalPeriod | null>(null);
  protected readonly activateOpen = signal(false);
  protected readonly activating = signal<FiscalPeriod | null>(null);
  protected readonly busy = signal(false);

  protected readonly rowKey = (row: FiscalPeriod): string => row.id;
  protected readonly columns: TableColumn<FiscalPeriod>[] = [
    { key: 'name', header: 'نام دوره' },
    { key: 'startDate', header: 'تاریخ شروع', width: '150px' },
    { key: 'endDate', header: 'تاریخ پایان', width: '150px' },
    { key: 'isActive', header: 'وضعیت', width: '130px' },
  ];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    startDate: new FormControl<string | null>(null, Validators.required),
    endDate: new FormControl<string | null>(null, Validators.required)
  }, { validators: rangeValidator });

  constructor() {
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(pageNumber, pageSize));
    });
  }

  protected jalali(iso: string): string {
    const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
    return formatJalali(toJalali(new Date(year, month - 1, day)));
  }

  private async load(pageNumber: number, pageSize: number): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.periods.list({ pageNumber, pageSize }));
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected openCreate(): void {
    this.form.reset({ name: '', startDate: null, endDate: null });
    this.formOpen.set(true);
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, startDate, endDate } = this.form.getRawValue();
    this.busy.set(true);
    try {
      await firstValueFrom(this.periods.create({ name: name.trim(), startDate: startDate as string, endDate: endDate as string }));
      this.notify.success('دوره مالی ایجاد شد.');
      this.formOpen.set(false);
      await this.load(this.page(), this.pageSize());
    } catch {
      /* keep the dialog open so the input can be corrected */
    } finally {
      this.busy.set(false);
    }
  }

  protected askActivate(row: FiscalPeriod): void {
    this.activating.set(row);
    this.activateOpen.set(true);
  }

  protected async activate(): Promise<void> {
    const row = this.activating();
    if (!row) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.periods.activate(row, !row.isActive));
      this.notify.success(`«${row.name}» فعال شد.`);
      this.activateOpen.set(false);
      await this.load(this.page(), this.pageSize());
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.busy.set(false);
    }
  }

  protected askDelete(row: FiscalPeriod): void {
    this.deleting.set(row);
    this.deleteOpen.set(true);
  }

  protected async confirmDelete(): Promise<void> {
    const row = this.deleting();
    if (!row) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.periods.remove(row.id));
      this.notify.success(`«${row.name}» حذف شد.`);
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
