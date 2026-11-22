import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DataTable, TableCell, TableColumn } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { JalaliDatePipe } from '../../../../shared/pipes/date-pipe';
import { toFaDigits } from '../../../../shared/utils/digits.utils';
import { formatJalali, toJalali } from '../../../../shared/utils/jalali.utils';
import { GeneralLedgerFilters, GeneralLedgerItem, GeneralLedgerSummary, readLedgerFilters } from '../../models/general-ledger.model';
import { GeneralLedgerService } from '../../services/general-ledger.service';

interface LedgerRow extends GeneralLedgerItem {
  key: string;
}

/**
 * Result step of the general ledger: one summary plus the paged lines for the chosen filters.
 * The document number opens that journal.
 */
@Component({
  selector: 'app-general-ledger-result',
  imports: [PageHeader, DataTable, TableCell, RouterLink, FaNumberPipe, JalaliDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-ledger-result.html',
  styleUrl: './general-ledger.css',
})
export class GeneralLedgerResultPage {
  private readonly ledgers = inject(GeneralLedgerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly filters: GeneralLedgerFilters | null = readLedgerFilters(this.route.snapshot.queryParamMap);
  protected readonly summary = signal<GeneralLedgerSummary | null>(null);
  protected readonly rows = signal<readonly LedgerRow[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  private summaryLoaded = false;
  private requestId = 0;

  protected readonly rowKey = (row: LedgerRow): string => row.key;

  protected readonly columns: TableColumn<LedgerRow>[] = [
    { key: 'date', header: 'تاریخ', width: '120px' },
    { key: 'number', header: 'شماره سند', width: '110px' },
    { key: 'sequence', header: 'ردیف', width: '80px' },
    { key: 'accountCode', header: 'کد حساب', width: '110px' },
    { key: 'accountName', header: 'نام حساب', width: '160px' },
    { key: 'description', header: 'شرح' },
    { key: 'debit', header: 'بدهکار', width: '130px' },
    { key: 'credit', header: 'بستانکار', width: '130px' },
    { key: 'balance', header: 'مانده', width: '140px' },
  ];

  protected rangeLabel(): string {
    const filters = this.filters;
    if (!filters) return '';
    return `از ${jalaliLabel(filters.startDate)} تا ${jalaliLabel(filters.endDate)}`;
  }

  protected readonly summaryItems = computed(() => {
    const summary = this.summary();
    if (!summary) return [];
    return [
      { label: 'بدهکار اول دوره', value: summary.openingDebit },
      { label: 'بستانکار اول دوره', value: summary.openingCredit },
      { label: 'گردش بدهکار', value: summary.periodDebit },
      { label: 'گردش بستانکار', value: summary.periodCredit },
      { label: 'مانده بدهکار', value: summary.closingDebit },
      { label: 'مانده بستانکار', value: summary.closingCredit },
    ];
  });

  constructor() {
    const filters = this.filters;
    if (!filters) {
      void this.router.navigate(['/accounting/general-ledger']);
      return;
    }
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      untracked(() => void this.load(filters, pageNumber, pageSize));
    });
  }

  protected changeFilters(): void {
    const filters = this.filters;
    if (!filters) return;
    void this.router.navigate(['/accounting/general-ledger'], {
      queryParams: {
        accountId: filters.accountId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        branchId: filters.branchId ?? undefined,
      },
    });
  }

  private async load(filters: GeneralLedgerFilters, pageNumber: number, pageSize: number): Promise<void> {
    const requestId = ++this.requestId;
    this.loading.set(true);
    const summaryPromise = this.summaryLoaded
      ? Promise.resolve(this.summary())
      : firstValueFrom(this.ledgers.summary(filters));
    const [summaryResult, itemsResult] = await Promise.allSettled([
      summaryPromise,
      firstValueFrom(this.ledgers.items(filters, { pageNumber, pageSize })),
    ]);
    if (requestId !== this.requestId) return;
    if (summaryResult.status === 'fulfilled' && summaryResult.value) {
      this.summary.set(summaryResult.value);
      this.summaryLoaded = true;
    }
    if (itemsResult.status === 'fulfilled') {
      const offset = (pageNumber - 1) * pageSize;
      this.rows.set((itemsResult.value.items ?? []).map((item, index) => ({
        ...item,
        key: `${item.journalId}-${item.sequence}-${offset + index}`,
      })));
      this.total.set(Number(itemsResult.value.totalCount));
    } else {
      this.rows.set([]);
      this.total.set(0);
    }
    this.loading.set(false);
  }
}

function jalaliLabel(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return toFaDigits(formatJalali(toJalali(new Date(year, month - 1, day))));
}
