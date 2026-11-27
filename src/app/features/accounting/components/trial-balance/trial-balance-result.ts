import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DataTable, TableCell, TableColumn } from '../../../../shared/components/data-table/data-table';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { TrialBalanceFilters, TrialBalanceItem, readTrialBalanceFilters } from './trial-balance.model';
import { TrialBalanceService, TrialBalanceApiItem } from '../../services/trial-balance.service';

interface TrialBalanceRow extends TrialBalanceItem {
  key: string;
}
@Component({
  selector: 'app-trial-balance-result',
  imports: [PageHeader, DataTable, TableCell, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trial-balance-result.html',
  styleUrl: './trial-balance.css',
})
export class TrialBalanceResultPage {
  private readonly trialBalanceService = inject(TrialBalanceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly filters: TrialBalanceFilters | null = readTrialBalanceFilters(this.route.snapshot.queryParamMap);
  protected readonly rows = signal<readonly TrialBalanceRow[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  private requestId = 0;

  protected readonly rowKey = (row: TrialBalanceRow): string => row.key;

  protected readonly columns: TableColumn<TrialBalanceRow>[] = [
    { key: 'accountCode', header: 'کد حساب', width: '110px' },
    { key: 'accountName', header: 'نام حساب', width: '200px' },
    { key: 'openingDebit', header: 'بدهکار اول دوره', width: '130px' },
    { key: 'openingCredit', header: 'بستانکار اول دوره', width: '130px' },
    { key: 'periodDebit', header: 'بدهکار دوره', width: '130px' },
    { key: 'periodCredit', header: 'بستانکار دوره', width: '130px' },
    { key: 'closingDebit', header: 'بدهکار پایان دوره', width: '140px' },
    { key: 'closingCredit', header: 'بستانکار پایان دوره', width: '140px' },
  ];

  protected readonly title = computed(() => {
    const filters = this.filters;
    if (!filters) return 'تراز آزمایشی';
    switch (filters.level) {
      case 1:
        return 'تراز آزمایشی کل';
      case 2:
        return 'تراز آزمایشی معین';
      case 3:
        return 'تراز آزمایشی تفصیلی';
      default:
        return 'تراز آزمایشی';
    }
  });

  constructor() {
    const filters = this.filters;
    if (!filters) {
      void this.router.navigate(['/accounting/trial-balance/general']);
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
    const filterRoute = this.getFilterRoute(filters.level);
    void this.router.navigate([filterRoute], {
      queryParams: {
        startDate: filters.startDate,
        endDate: filters.endDate,
        branchId: filters.branchId ?? undefined,
      },
    });
  }

  private getFilterRoute(level: number): string {
    switch (level) {
      case 1:
        return '/accounting/trial-balance/general';
      case 2:
        return '/accounting/trial-balance/subsidiary';
      case 3:
        return '/accounting/trial-balance/detail';
      default:
        return '/accounting/trial-balance/general';
    }
  }

  private async load(filters: TrialBalanceFilters, pageNumber: number, pageSize: number): Promise<void> {
    const requestId = ++this.requestId;
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.trialBalanceService.items(filters, { pageNumber, pageSize }));
      if (requestId !== this.requestId) return;
      this.rows.set((result.items ?? []).map((item, index) => ({
        accountCode: item.accountCode,
        accountName: item.accountName,
        openingDebit: item.debitUntilPeriod,
        openingCredit: item.creditUntilPeriod,
        periodDebit: item.debitDuringPeriod,
        periodCredit: item.creditDuringPeriod,
        closingDebit: item.debitBalance,
        closingCredit: item.creditBalance,
        key: `${item.accountId}-${index}`,
      })));
      this.total.set(Number(result.totalCount));
    } catch {
      this.rows.set([]);
      this.total.set(0);
    } finally {
      this.loading.set(false);
    }
  }
}