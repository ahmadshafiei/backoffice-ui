import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { SelectField } from '../../../../shared/components/fields/select-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { AccountLevel } from '../../models/account.model';
import { BRANCH_OPTIONS } from '../../models/journal.model';
import { FiscalPeriodService } from '../../services/fiscal-period.service';

@Component({
  selector: 'app-trial-balance-filter',
  imports: [ReactiveFormsModule, PageHeader, Datepicker, SelectField, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trial-balance-filter.html',
  styleUrl: './trial-balance.css',
})
export class TrialBalanceFilterPage {
  private readonly fiscalService = inject(FiscalPeriodService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly branchOptions = BRANCH_OPTIONS;
  protected readonly dateMessages = { dateOrder: 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد.' };

  protected readonly level = signal<AccountLevel>(AccountLevel.General);
  protected readonly title = signal<string>('تراز آزمایشی کل');
  protected readonly subtitle = signal<string>('بازه تاریخ را انتخاب کنید.');

  protected readonly form = new FormGroup({
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

    this.form.controls.startDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.controls.endDate.updateValueAndValidity({ emitEvent: false });
    });
    void this.loadActiveFiscalPeriod();
  }

  private updateTitleAndSubtitle(level: AccountLevel): void {
    switch (level) {
      case AccountLevel.General:
        this.title.set('تراز آزمایشی کل');
        break;
      case AccountLevel.Subsidiary:
        this.title.set('تراز آزمایشی معین');
        break;
      case AccountLevel.Detail:
        this.title.set('تراز آزمایشی تفصیلی');
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
        return '/accounting/trial-balance/general/result';
      case AccountLevel.Subsidiary:
        return '/accounting/trial-balance/subsidiary/result';
      case AccountLevel.Detail:
        return '/accounting/trial-balance/detail/result';
      default:
        return '/accounting/trial-balance/general/result';
    }
  }

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