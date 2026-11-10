import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { TextField } from '../../../../shared/components/fields/text-field';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { AccountingApi } from '../../accounting-api';

type LengthControl = 'groupAccountLength' | 'generalAccountLength' | 'subsidiaryAccountLength' | 'detailAccountLength';

/**
 * Accounting settings (تنظیم حساب‌ها). The only setting so far is the code length of each account
 * level, so the page factors «طول کد» out into one section and each field keeps just the level name.
 */
@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule, PageHeader, TextField, Icon, FaNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettingsPage {
  private readonly api = inject(AccountingApi);
  private readonly notify = inject(NotificationApi);

  protected readonly fields: readonly { control: LengthControl; label: string }[] = [
    { control: 'groupAccountLength', label: 'گروه حساب‌های کل' },
    { control: 'generalAccountLength', label: 'حساب‌های کل' },
    { control: 'subsidiaryAccountLength', label: 'حساب‌های معین' },
    { control: 'detailAccountLength', label: 'حساب‌های تفصیلی' },
  ];

  protected readonly form = new FormGroup({
    groupAccountLength: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
    generalAccountLength: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
    subsidiaryAccountLength: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
    detailAccountLength: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
  });

  /** Sum of the four lengths – a quick sanity check on the total code width. */
  protected readonly total = toSignal(
    this.form.valueChanges.pipe(map(() => this.sumLengths())),
    { initialValue: 0 },
  );

  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly busy = signal(false);

  constructor() {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.form.disable();
    try {
      const settings = await firstValueFrom(this.api.getSettings());
      this.form.reset({
        // The GET response names the first field `groupAccountCodeLength` (the PUT body does not).
        groupAccountLength: this.asText(settings.groupAccountCodeLength),
        generalAccountLength: this.asText(settings.generalAccountLength),
        subsidiaryAccountLength: this.asText(settings.subsidiaryAccountLength),
        detailAccountLength: this.asText(settings.detailAccountLength),
      });
    } catch {
      // The interceptor already showed the error; keep the page usable for a retry.
      this.loadFailed.set(true);
    } finally {
      this.form.enable();
      this.loading.set(false);
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.setSettings({
        groupAccountLength: Number(raw.groupAccountLength),
        generalAccountLength: Number(raw.generalAccountLength),
        subsidiaryAccountLength: Number(raw.subsidiaryAccountLength),
        detailAccountLength: Number(raw.detailAccountLength),
      }));
      this.notify.success('تنظیم حساب‌ها ذخیره شد.');
      this.form.markAsPristine();
    } catch {
      // 400 / other failures are surfaced by the interceptor; the form keeps the user's input.
    } finally {
      this.busy.set(false);
    }
  }

  private sumLengths(): number {
    return this.fields.reduce((sum, field) => sum + (Number(this.form.controls[field.control].value) || 0), 0);
  }

  private asText(value: number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
  }
}
