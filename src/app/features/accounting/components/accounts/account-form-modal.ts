import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationApi } from '../../../../core/services/notification-api';
import { SelectField, SelectOption } from '../../../../shared/components/fields/select-field';
import { TextField } from '../../../../shared/components/fields/text-field';
import { ToggleField } from '../../../../shared/components/fields/toggle-field';
import { Modal } from '../../../../shared/components/modal/modal';
import {
  ACCOUNT_LEVEL_LABEL, ACCOUNT_TYPE_OPTIONS, Account, AccountLevel, AccountType, NORMAL_BALANCE_OPTIONS, NormalBalance,
} from '../../accounting.model';
import { AccountsStore } from '../../accounts-store';

let nextFormId = 0;

/**
 * Create / edit dialog for one account level.
 *
 * Only name, status and "detail allowed" can change after creation (the PATCH contract), so in
 * edit mode the identity fields are shown read-only.
 */
@Component({
  selector: 'app-account-form-modal',
  imports: [ReactiveFormsModule, Modal, TextField, SelectField, ToggleField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-form-modal.html',
  styleUrl: './account-form-modal.css',
})
export class AccountFormModal {
  readonly open = model(false);
  readonly level = input.required<AccountLevel>();
  /** The account being edited; `null` means create. */
  readonly account = input<Account | null>(null);

  private readonly store = inject(AccountsStore);
  private readonly notify = inject(NotificationApi);

  protected readonly formId = `account-form-${nextFormId++}`;
  protected readonly busy = signal(false);
  protected readonly isEdit = computed(() => this.account() !== null);
  protected readonly noun = computed(() => ACCOUNT_LEVEL_LABEL[this.level()]);
  protected readonly title = computed(() => `${this.isEdit() ? 'ویرایش' : 'ایجاد'} ${this.noun()}`);

  protected readonly typeOptions = ACCOUNT_TYPE_OPTIONS;
  protected readonly balanceOptions = NORMAL_BALANCE_OPTIONS;
  protected readonly showParent = computed(() => this.level() !== AccountLevel.Group);
  protected readonly showType = computed(() => this.level() == AccountLevel.Group);
  protected readonly showBalance = computed(() => this.level() !== AccountLevel.Group);
  protected readonly showDetailAllowed = computed(() => this.level() === AccountLevel.Subsidiary);

  protected readonly parentLabel = computed(() =>
    this.level() === AccountLevel.General ? 'گروه حساب' : 'حساب کل');

  protected readonly parentOptions = computed<readonly SelectOption[]>(() => {
    const parents = this.level() === AccountLevel.General ? this.store.groups() : this.store.generals();
    return parents.map((p) => ({ value: p.id, label: `${p.name} (${p.accountCode})` }));
  });

  protected readonly form = new FormGroup({
    accountCode: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d+$/)] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    parentId: new FormControl<string | null>(null),
    accountType: new FormControl<AccountType | null>(null),
    normalBalance: new FormControl<NormalBalance | null>(null),
    isActive: new FormControl(true, { nonNullable: true }),
    isDetailAllowed: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      if (this.open()) untracked(() => this.prepare());
    });

    // A general account normally shares its group's type – pre-fill it, the user can still change it.
    this.form.controls.parentId.valueChanges.pipe(takeUntilDestroyed()).subscribe((id) => {
      if (this.level() !== AccountLevel.General || this.isEdit() || !id) return;
      const group = this.store.byId().get(id);
      if (group) this.form.controls.accountType.setValue(group.accountType);
    });
  }

  private prepare(): void {
    const { controls } = this.form;
    const account = this.account();
    const level = this.level();

    this.form.enable({ emitEvent: false });
    this.form.reset(
      {
        accountCode: account?.accountCode ?? '',
        name: account?.name ?? '',
        parentId: account?.parentId ?? null,
        accountType: account?.accountType ?? null,
        normalBalance: account?.normalBalance ?? null,
        isActive: account?.isActive ?? true,
        isDetailAllowed: account?.isDetailAllowed ?? false,
      },
      { emitEvent: false },
    );

    setRequired(controls.parentId, level !== AccountLevel.Group);
    setRequired(controls.accountType, level !== AccountLevel.Subsidiary);
    setRequired(controls.normalBalance, level !== AccountLevel.Group);

    if (account) {
      controls.accountCode.disable({ emitEvent: false });
      controls.parentId.disable({ emitEvent: false });
      controls.accountType.disable({ emitEvent: false });
      controls.normalBalance.disable({ emitEvent: false });
    }
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const level = this.level();
    const account = this.account();
    const isSubsidiary = level === AccountLevel.Subsidiary;
    const name = value.name.trim();

    this.busy.set(true);
    try {
      if (account) {
        await this.store.modify(account.id, {
          name,
          isActive: value.isActive,
          isPostable: account.isPostable,
          isDetailAllowed: isSubsidiary ? value.isDetailAllowed : account.isDetailAllowed,
        });
        this.notify.success('تغییرات ذخیره شد.');
      } else {
        const parent = value.parentId ? this.store.byId().get(value.parentId) : undefined;
        await this.store.register({
          name,
          accountCode: value.accountCode,
          isActive: value.isActive,
          accountLevel: level,
          // A subsidiary account has no type of its own in the form: it follows its general account.
          accountType: isSubsidiary ? (parent?.accountType ?? null) : value.accountType,
          // Only subsidiary accounts are leaves that documents can post to.
          isPostable: isSubsidiary,
          isDetailAllowed: isSubsidiary ? value.isDetailAllowed : false,
          normalBalance: level === AccountLevel.Group ? null : value.normalBalance,
          parentId: level === AccountLevel.Group ? null : value.parentId,
        });
        this.notify.success(`${this.noun()} ایجاد شد.`);
      }
      this.open.set(false);
    } catch {
      /* the interceptor already showed the server's reason; keep the dialog open for correction */
    } finally {
      this.busy.set(false);
    }
  }
}

function setRequired(control: FormControl, required: boolean): void {
  control.setValidators(required ? [Validators.required] : []);
  control.updateValueAndValidity({ emitEvent: false });
}
