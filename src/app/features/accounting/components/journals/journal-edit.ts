import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SearchSelect } from '../../../../shared/components/search-select/search-select';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import {
  BRANCH_OPTIONS,
  JOURNAL_TYPE_OPTIONS,
  JournalState,
  JournalItem,
  SaveJournalRequest,
} from '../../models/journal.model';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { SelectField } from '../../../../shared/components/fields/select-field';
import { TextField } from '../../../../shared/components/fields/text-field';
import { JournalService } from '../../services/journal.service';
import { oppositeSide, toNonNegativeAmount, validateJournalItems } from '../../utils/journal.utils';

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
    SearchSelect,
    FaNumberPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './journal-edit.html',
  styleUrl: './journal-edit.css',
})
export class JournalEditPage {
  private readonly journals = inject(JournalService);
  private readonly accounts = inject(AccountService);
  private readonly notify = inject(NotificationApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly branchOptions = BRANCH_OPTIONS;
  protected readonly typeOptions = JOURNAL_TYPE_OPTIONS;

  protected readonly isEdit = signal(false);
  protected readonly readOnly = signal(false);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly journalId = signal<string | null>(null);

  protected readonly searchAccounts = (term: string): Observable<readonly Account[]> =>
    this.accounts
      .searchPostable({ searchExp: term || undefined })
      .pipe(map((result) => result.items ?? []));
  protected readonly accountValue = (account: Account): string => account.id;
  protected readonly accountLabel = (account: Account): string => `${account.accountCode} - ${account.name}`;
  /** Account names that came with the loaded journal (`accountName`), keyed by account id. */
  private readonly knownAccountNames = new Map<string, string>();
  /** Uses the name delivered with the journal; only falls back to the accounts API for unknown ids. */
  protected readonly resolveAccountLabel = (id: string): Observable<string> => {
    const known = this.knownAccountNames.get(id);
    return known !== undefined
      ? of(known)
      : this.accounts.get(id).pipe(map((account) => `${account.accountCode} - ${account.name}`));
  };
  protected readonly splitAccountLabel = (label: string): { code: string; name: string } | null => {
    const separator = label.indexOf(' - ');
    return separator < 0
      ? null
      : { code: label.slice(0, separator), name: label.slice(separator + 3) };
  };

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
    this.items.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.itemsSignal.update((v) => v + 1));

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
    const group = new FormGroup<ItemForm>({
      accountId: new FormControl<string | null>(item?.accountId ?? null, Validators.required),
      debit: new FormControl<number | null>(item?.debit ? toNonNegativeAmount(item.debit) : null, Validators.min(0)),
      credit: new FormControl<number | null>(item?.credit ? toNonNegativeAmount(item.credit) : null, Validators.min(0)),
      description: new FormControl(item?.description ?? '', { nonNullable: true }),
    });
    this.watchAmount(group, 'debit');
    this.watchAmount(group, 'credit');
    return group;
  }

  /** A row is either debit or credit: filling one side clears the other, and negatives become 0. */
  private watchAmount(group: ItemGroup, side: 'debit' | 'credit'): void {
    group.controls[side].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((raw) => {
      const safe = toNonNegativeAmount(raw);
      if (safe !== raw) group.controls[side].setValue(safe, { emitEvent: false });
      if ((safe ?? 0) > 0) group.controls[oppositeSide(side)].setValue(null, { emitEvent: false });
    });
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const journal = await firstValueFrom(this.journals.get(id));
      this.readOnly.set(journal.state === JournalState.Posted);
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
      const items = [...(journal.items ?? [])].sort((a, b) => a.sequence - b.sequence);
      this.knownAccountNames.clear();
      for (const item of items) if (item.accountName) this.knownAccountNames.set(item.accountId, item.accountName);
      for (const item of items) this.items.push(this.makeItem(item), { emitEvent: false });
      if (this.items.length === 0) this.items.push(this.makeItem(), { emitEvent: false });
      this.itemsSignal.update((v) => v + 1);
      if (this.readOnly()) this.disableForm();
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  protected addItem(): void {
    if (this.readOnly()) return;
    if (this.itemCount() >= this.pageSize()) this.page.set(this.itemPageCount() + 1);
    this.items.push(this.makeItem());
  }

  protected removeItem(index: number): void {
    if (this.readOnly()) return;
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
    return validateJournalItems(this.items.getRawValue());
  }

  private disableForm(): void {
    this.header.disable({ emitEvent: false });
    for (const group of this.items.controls) group.disable({ emitEvent: false });
  }

  protected async save(): Promise<void> {
    if (this.readOnly()) return;
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
          debit: toNonNegativeAmount(raw.debit) ?? 0,
          credit: toNonNegativeAmount(raw.credit) ?? 0,
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
