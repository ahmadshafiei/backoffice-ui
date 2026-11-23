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
import { readLedgerFilters } from '../../models/general-ledger.model';
import { BRANCH_OPTIONS } from '../../models/journal.model';
import { AccountService } from '../../services/account.service';
import { FiscalPeriodService } from '../../services/fiscal-period.service';

@Component({
  selector: 'app-general-ledger-filter',
  imports: [ReactiveFormsModule, PageHeader, Datepicker, SelectField, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-ledger-filter.html',
  styleUrl: './general-ledger.css',
})
export class GeneralLedgerFilterPage {
  private readonly accountsApi = inject(AccountService);
  private readonly fiscalService = inject(FiscalPeriodService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly branchOptions = BRANCH_OPTIONS;
  protected readonly accountOptions = signal<readonly SelectOption<string>[]>([]);
  protected readonly loadingAccounts = signal(true);
  protected readonly dateMessages = { dateOrder: 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.' };

  protected readonly form = new FormGroup({
    accountId: new FormControl<string | null>(null, Validators.required),
    startDate: new FormControl<string | null>(null, Validators.required),
    endDate: new FormControl<string | null>(null, [Validators.required, endOnOrAfterStart]),
    branchId: new FormControl<number | null>(null),
  });

  constructor() {
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

  protected search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    void this.router.navigate(['/accounting/general-ledger/result'], {
      queryParams: {
        accountId: value.accountId,
        startDate: value.startDate,
        endDate: value.endDate,
        branchId: value.branchId ?? undefined,
      },
    });
  }

  private async loadAccounts(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.accountsApi.all(AccountLevel.General));
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
