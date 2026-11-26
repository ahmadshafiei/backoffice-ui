import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { SelectField, SelectOption } from '../../../../shared/components/fields/select-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { AccountLevel } from '../../models/account.model';
import { readLedgerFilters } from '../../models/ledger.model';
import { BRANCH_OPTIONS } from '../../models/journal.model';
import { AccountService } from '../../services/account.service';
import { FiscalPeriodService } from '../../services/fiscal-period.service';

@Component({
  selector: 'app-ledger-filter',
  imports: [ReactiveFormsModule, PageHeader, Datepicker, SelectField, Icon],
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
  protected readonly accountOptions = signal<readonly SelectOption<string>[]>([]);
  protected readonly loadingAccounts = signal(true);
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
    void this.loadAccounts();
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

  private async loadAccounts(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.accountsApi.all(this.level()));
      this.accountOptions.set(rows.map((account) => ({
        value: account.id,
        label: `${account.accountCode} — ${account.name}`,
      })));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loadingAccounts.set(false);
    }
  }

  private async loadActiveFiscalPeriod(): Promise<void> {
    let activeFiscalPeriod = await firstValueFrom(this.fiscalService.getActive());

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