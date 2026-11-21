import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DataTable, TableCell, TableColumn, TableRowActions } from '../../../../shared/components/data-table/data-table';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { JalaliDatePipe } from '../../../../shared/pipes/date-pipe';
import { JOURNAL_STATE_LABEL, JOURNAL_TYPE_LABEL, Journal, JournalState } from '../../models/journal.model';
import { JournalService } from '../../services/journal.service';

/**
 * Journal list (اسناد حسابداری).
 *
 * Server-paged table of all journals. There is no delete; creating and editing happen on a
 * dedicated page (`/accounting/journals/new` and `/accounting/journals/:id`).
 */
@Component({
  selector: 'app-journals',
  imports: [PageHeader, Icon, DataTable, TableCell, TableRowActions, FaNumberPipe, JalaliDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './journals.html',
  styleUrl: '../accounts/list-page.css',
})
export class JournalsPage {
  private readonly journals = inject(JournalService);
  private readonly router = inject(Router);

  protected readonly rows = signal<readonly Journal[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly rowKey = (row: Journal): string => row.id;

  protected readonly columns: TableColumn<Journal>[] = [
    { key: 'number', header: 'شماره', width: '90px' },
    { key: 'date', header: 'تاریخ', width: '150px' },
    { key: 'branchId', header: 'شعبه', width: '150px' },
    { key: 'state', header: 'وضعیت', width: '120px' },
    { key: 'type', header: 'نوع', width: '110px' },
    { key: 'description', header: 'شرح' },
    { key: 'debit', header: 'بدهکار', width: '130px' },
    { key: 'credit', header: 'بستانکار', width: '130px' },
  ];

  protected readonly branchLabels: Record<number, string> = { 1: 'شعبه مرکزی', 2: 'شعبه شهرک غرب' };

  protected stateLabel(state: number): string {
    return JOURNAL_STATE_LABEL[state] ?? '—';
  }

  protected typeLabel(type: number): string {
    return JOURNAL_TYPE_LABEL[type] ?? '—';
  }

  protected branchLabel(branchId: number): string {
    return this.branchLabels[branchId] ?? String(branchId);
  }

  protected isPosted(row: Journal): boolean {
    return row.state === JournalState.Posted;
  }

  constructor() {
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(pageNumber, pageSize));
    });
  }

  private async load(pageNumber: number, pageSize: number): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.journals.list({ pageNumber, pageSize }));
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected create(): void {
    void this.router.navigate(['/accounting/journals/new']);
  }

  protected edit(row: Journal): void {
    void this.router.navigate(['/accounting/journals', row.id]);
  }
}
