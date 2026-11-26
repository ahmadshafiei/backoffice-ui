import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { SearchSelect } from '../../../../shared/components/search-select/search-select';
import { SelectField } from '../../../../shared/components/fields/select-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Account, AccountLevel } from '../../models/account.model';
import { readLedgerFilters } from '../../models/ledger.model';
import { BRANCH_OPTIONS } from '../../models/journal.model';
import { AccountService } from '../../services/account.service';
import { FiscalPeriodService } from '../../services/fiscal-period.service';

@Component({
  selector: 'app-ledger-filter',
  imports: [ReactiveFormsModule, PageHeader, Datepicker, SearchSelect, SelectField, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ledger-filter.html',
  styleUrl: './ledger.css',
})
export class LedgerFilterPage {
  private readonly accountsApi = inject(AccountService);
  private readonly fiscalService = inject(FiscalPeriodService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly branchOptions = BRANCH_OPTIONS;
  protected readonly dateMessages = { dateOrder: 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.' };

  protected readonly level = signal<AccountLevel>(AccountLevel.General);
  protected readonly title = signal<string>('دفتر کل');
  protected readonly subtitle = signal<string>('حساب کل، بازه تاریخ و در صورت نیاز شعبه را انتخاب کنید.');

  protected readonly form = new FormGroup({
    accountId: new FormControl<string | null>(null, Validators.required),
    startDate: new FormControl<string | null>(null, Validators.required),
    endDate: new FormControl<string | null>(null, [Validators.required, endOnOrAfterStart]),
    branchId: new FormControl<number | null>(null),
  });

  constructor() {
    const routeData = this.route.snapshot.data;
    if (routeData['level'] !== undefined) {
      this.level.set(routeData['level']);
      this.updateTitleAndSubtitle(routeData['level']);
    }

    const restored = readLedgerFilters(this.route.snapshot.queryParamMap);
    if (restored) {
      this.form.setValue({
        accountId: restored.accountId,
        startDate: restored.startDate,
        endDate: restored.endDate,
        branchId: restored.branchId,
      });
    }
    this.form.controls.startDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.controls.endDate.updateValueAndValidity({ emitEvent: false });
    });
    void this.loadActiveFiscalPeriod();
  }

  private updateTitleAndSubtitle(level: AccountLevel): void {
    switch (level) {
      case AccountLevel.General:
        this.title.set('دفتر کل');
        this.subtitle.set('حساب کل، بازه تاریخ و در صورت نیاز شعبه را انتخاب کنید.');
        break;
      case AccountLevel.Subsidiary:
        this.title.set('دفتر معین');
        this.subtitle.set('حساب معین، بازه تاریخ و در صورت نیاز شعبه را انتخاب کنید.');
        break;
      case AccountLevel.Detail:
        this.title.set('دفتر تفصیلی');
        this.subtitle.set('حساب تفصیلی، بازه تاریخ و در صورت نیاز شعبه را انتخاب کنید.');
        break;
    }
  }

  protected search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    // Get account details to pass to result page
    this.accountsApi.get(value.accountId!).subscribe({
      next: (account) => {
        const resultRoute = this.getResultRoute();
        void this.router.navigate([resultRoute], {
          queryParams: {
            accountId: value.accountId,
            accountCode: account.accountCode,
            accountName: account.name,
            startDate: value.startDate,
            endDate: value.endDate,
            branchId: value.branchId ?? undefined,
            level: this.level(),
          },
        });
      },
      error: () => {
        // Navigate without account code/name if fetch fails
        const resultRoute = this.getResultRoute();
        void this.router.navigate([resultRoute], {
          queryParams: {
            accountId: value.accountId,
            startDate: value.startDate,
            endDate: value.endDate,
            branchId: value.branchId ?? undefined,
            level: this.level(),
          },
        });
      }
    });
  }

  private getResultRoute(): string {
    switch (this.level()) {
      case AccountLevel.General:
        return '/accounting/general-ledger/result';
      case AccountLevel.Subsidiary:
        return '/accounting/subsidiary-ledger/result';
      case AccountLevel.Detail:
        return '/accounting/detail-ledger/result';
      default:
        return '/accounting/general-ledger/result';
    }
  }

  protected readonly searchAccounts = (term: string): Observable<readonly Account[]> => {
    return this.accountsApi.searchByLevel({
      accountLevel: this.level(),
      searchExp: term,
    }).pipe(map((res) => res.items ?? []));
  };

  protected readonly optionValue = (account: Account): string => account.id;
  protected readonly optionLabel = (account: Account): string => `${account.accountCode} — ${account.name}`;

  protected readonly resolveLabel = (value: string): Observable<string> => {
    return this.accountsApi.get(value).pipe(map((account) => `${account.accountCode} — ${account.name}`));
  };

  protected readonly splitLabel = (label: string): { code: string; name: string } | null => {
    const parts = label.split(' — ');
    if (parts.length === 2) {
      return { code: parts[0], name: parts[1] };
    }
    return null;
  };

  private loadActiveFiscalPeriod(): void {
    const activeFiscalPeriod = this.fiscalService.activePeriod();
    if (activeFiscalPeriod !== null) {
      this.form.patchValue({
        startDate: activeFiscalPeriod.startDate,
        endDate: activeFiscalPeriod.endDate
      });
    }
  }
}

function endOnOrAfterStart(control: AbstractControl): ValidationErrors | null {
  const start = control.parent?.get('startDate')?.value as string | null;
  const end = control.value;
  if (!start || !end || end >= start) return null;
  return { dateOrder: true };
}