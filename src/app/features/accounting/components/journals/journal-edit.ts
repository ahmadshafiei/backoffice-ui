import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import {
  BRANCH_OPTIONS,
  JOURNAL_TYPE_OPTIONS,
  JournalItem,
  SaveJournalRequest,
} from '../../models/journal.model';
import { AccountPicker } from './account-picker';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { SelectField } from '../../../../shared/components/fields/select-field';
import { TextField } from '../../../../shared/components/fields/text-field';
import { JournalService } from '../../services/journal.service';

interface ItemForm {
  accountId: FormControl<string | null>;
  debit: FormControl<number | null>;
  credit: FormControl<number | null>;
  description: FormControl<string>;
}

type ItemGroup = FormGroup<ItemForm>;

/**
 * Create / edit one journal (اسناد).
 *
 * Top section: header fields (date, branch, type, description).
 * Bottom section: the journal `items` shown with **client-side** pagination. Adding / removing /
 * editing happens locally; the whole `items` array is sent on save (not just the visible page).
 * A journal needs at least two rows with one debit and one credit.
 */
@Component({
  selector: 'app-journal-edit',
  imports: [
    ReactiveFormsModule,
    PageHeader,
    Icon,
    Datepicker,
    SelectField,
    TextField,
    AccountPicker,
    FaNumberPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './journal-edit.html',
  styleUrl: './journal-edit.css',
})
export class JournalEditPage {
  private readonly journals = inject(JournalService);
  private readonly notify = inject(NotificationApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly branchOptions = BRANCH_OPTIONS;
  protected readonly typeOptions = JOURNAL_TYPE_OPTIONS;

  protected readonly isEdit = signal(false);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly journalId = signal<string | null>(null);

  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly header = new FormGroup({
    date: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    branchId: new FormControl<number | null>(null, Validators.required),
    type: new FormControl<number | null>(null, Validators.required),
    description: new FormControl('', { nonNullable: true }),
  });

  protected readonly items = new FormArray<ItemGroup>([]);

  /** Bumped on any structural change so OnPush re-renders the rows. */
  private readonly itemsSignal = signal(0);

  protected readonly itemCount = computed(() => {
    this.itemsSignal();
    return this.items.length;
  });
  protected readonly totalDebit = computed(() => this.sum('debit'));
  protected readonly totalCredit = computed(() => this.sum('credit'));
  protected readonly balance = computed(() => this.totalDebit() - this.totalCredit());
  protected readonly itemPageCount = computed(() => Math.max(1, Math.ceil(this.itemCount() / this.pageSize())));
  protected readonly visibleStart = computed(() => (this.page() - 1) * this.pageSize());
  protected readonly visibleEnd = computed(() => Math.min(this.itemCount(), this.visibleStart() + this.pageSize()));

  constructor() {
    // Repaint rows / totals when an item value or the row count changes (OnPush).
    this.items.valueChanges.subscribe(() => this.itemsSignal.update((v) => v + 1));

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.journalId.set(id);
      void this.load(id);
    } else {
      this.resetHeader();
      this.items.push(this.makeItem());
      this.items.push(this.makeItem());
    }
  }

  private resetHeader(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.header.reset({ date: today, branchId: null, type: null, description: '' });
  }

  private makeItem(item?: JournalItem): ItemGroup {
    return new FormGroup<ItemForm>({
      accountId: new FormControl<string | null>(item?.accountId ?? null, Validators.required),
      debit: new FormControl<number | null>(item && item.debit ? item.debit : null),
      credit: new FormControl<number | null>(item && item.credit ? item.credit : null),
      description: new FormControl(item?.description ?? '', { nonNullable: true }),
    });
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const journal = await firstValueFrom(this.journals.get(id));
      this.header.reset(
        {
          date: journal.date ? journal.date.slice(0, 10) : '',
          branchId: journal.branchId,
          type: journal.type,
          description: journal.description ?? '',
        },
        { emitEvent: false },
      );
      this.items.clear();
      const items = journal.items?.length ? journal.items : [];
      for (const item of items) this.items.push(this.makeItem(item), { emitEvent: false });
      if (this.items.length === 0) this.items.push(this.makeItem(), { emitEvent: false });
      this.itemsSignal.update((v) => v + 1);
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected addItem(): void {
    if (this.itemCount() >= this.pageSize()) this.page.set(this.itemPageCount() + 1);
    this.items.push(this.makeItem());
  }

  protected removeItem(index: number): void {
    if (this.items.length <= 1) return;
    this.items.removeAt(index);
    const lastPage = Math.max(1, Math.ceil(this.items.length / this.pageSize()));
    if (this.page() > lastPage) this.page.set(lastPage);
  }

  protected goToPage(page: number): void {
    const last = this.itemPageCount();
    this.page.set(Math.min(Math.max(1, page), last));
  }

  private sum(key: 'debit' | 'credit'): number {
    this.itemsSignal();
    return this.items.controls.reduce((total, group) => {
      const value = group.controls[key].value;
      return total + (typeof value === 'number' && Number.isFinite(value) ? value : 0);
    }, 0);
  }

  private validateItems(): string | null {
    const controls = this.items.controls;
    if (controls.length < 2) return 'برای ثبت سند حداقل دو ردیف (یک بدهکار و یک بستانکار) لازم است.';

    let debitCount = 0;
    let creditCount = 0;
    for (const group of controls) {
      if (!group.controls.accountId.value) return 'حساب همه ردیف‌ها را انتخاب کنید.';
      const debit = group.controls.debit.value;
      const credit = group.controls.credit.value;
      if (debit && debit > 0) debitCount++;
      if (credit && credit > 0) creditCount++;
    }
    if (debitCount === 0 || creditCount === 0) return 'حداقل یک ردیف بدهکار و یک ردیف بستانکار باید وجود داشته باشد.';
    return null;
  }

  protected async save(): Promise<void> {
    if (this.header.invalid) {
      this.header.markAllAsTouched();
      this.notify.error('اطلاعات کلی سند را کامل کنید.');
      return;
    }
    const itemsError = this.validateItems();
    if (itemsError) {
      this.notify.error(itemsError);
      return;
    }

    const value = this.header.getRawValue();
    const body: SaveJournalRequest = {
      date: value.date,
      branchId: value.branchId as number,
      type: value.type as number,
      description: (value.description ?? '').trim(),
      items: this.items.controls.map((group, index) => {
        const raw = group.getRawValue();
        return {
          accountId: raw.accountId as string,
          debit: typeof raw.debit === 'number' && Number.isFinite(raw.debit) ? raw.debit : 0,
          credit: typeof raw.credit === 'number' && Number.isFinite(raw.credit) ? raw.credit : 0,
          sequence: index + 1,
          description: (raw.description ?? '').trim(),
        };
      }),
    };

    this.busy.set(true);
    try {
      const id = this.journalId();
      if (id) {
        await firstValueFrom(this.journals.update(id, body));
        this.notify.success('تغییرات سند ذخیره شد.');
      } else {
        await firstValueFrom(this.journals.create(body));
        this.notify.success('سند جدید ثبت شد.');
      }
      await this.router.navigate(['/accounting/journals']);
    } catch {
      /* keep the form so the user can retry */
    } finally {
      this.busy.set(false);
    }
  }

  protected cancel(): void {
    void this.router.navigate(['/accounting/journals']);
  }
}
