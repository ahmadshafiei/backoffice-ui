import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, firstValueFrom, map } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { Icon } from '../../../../shared/components/icon/icon';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ConfirmDialog } from '../../../../shared/components/modal/confirm-dialog';
import { SearchSelect } from '../../../../shared/components/search-select/search-select';
import { FaNumberPipe } from '../../../../shared/pipes/fa-number';
import { JalaliDatePipe } from '../../../../shared/pipes/date-pipe';
import {
  BRANCH_OPTIONS,
  JOURNAL_TYPE_OPTIONS,
  JournalState,
  JournalItem,
  SaveJournalRequest,
} from '../../models/journal.model';
import { Account, AccountLevel } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { Datepicker } from '../../../../shared/components/datepicker/datepicker';
import { MoneyInputDirective } from '../../../../shared/directives/money-input';
import { SelectField } from '../../../../shared/components/fields/select-field';
import { TextField } from '../../../../shared/components/fields/text-field';
import { JournalService } from '../../services/journal.service';
import { oppositeSide, toNonNegativeAmount, validateJournalItems } from '../../utils/journal.utils';

interface ItemForm {
  subsidiaryAccountId: FormControl<string | null>;
  detailAccountId: FormControl<string | null>;
  /** Mirrors the selected subsidiary's `isDetailAllowed` so the detail field can be required. */
  subsidiaryNeedsDetail: FormControl<boolean>;
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
    MoneyInputDirective,
    ConfirmDialog,
    FaNumberPipe,
    JalaliDatePipe,
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
  protected readonly state = signal<number | null>(null);
  /** Only draft journals can be finalised (posted). */
  protected readonly isDraft = computed(() => this.state() === JournalState.Draft);
  /** Posted journals are immutable. */
  protected readonly readOnly = computed(() => this.state() === JournalState.Posted);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly journalId = signal<string | null>(null);
  protected readonly postOpen = signal(false);
  /** Finalisation details, only present on posted journals. */
  protected readonly postedNumber = signal<number | null>(null);
  protected readonly postedByUser = signal<string | null>(null);
  protected readonly postedDate = signal<string | null>(null);

  /** Accounts seen in a search, keyed by id, so a picked row can report `isDetailAllowed`. */
  private readonly accountCache = new Map<string, Account>();

  /** Detail searches are per-row: they filter by the row's chosen subsidiary (`parentId`). */
  private readonly detailSearches = new WeakMap<ItemGroup, (term: string) => Observable<readonly Account[]>>();

  private searchByLevel(level: AccountLevel, term: string, parentId?: string): Observable<readonly Account[]> {
    return this.accounts.searchByLevel({ accountLevel: level, searchExp: term || undefined, parentId }).pipe(
      map((result) => {
        const items = result.items ?? [];
        for (const account of items) this.accountCache.set(account.id, account);
        return items;
      }),
    );
  }
  protected readonly searchSubsidiary = (term: string): Observable<readonly Account[]> =>
    this.searchByLevel(AccountLevel.Subsidiary, term);
  /** Returns the stable per-row detail search, scoped to that row's selected subsidiary. */
  protected readonly detailSearch = (group: ItemGroup): ((term: string) => Observable<readonly Account[]>) => {
    let search = this.detailSearches.get(group);
    if (!search) {
      search = (term: string) =>
        this.searchByLevel(AccountLevel.Detail, term, group.controls.subsidiaryAccountId.value ?? undefined);
      this.detailSearches.set(group, search);
    }
    return search;
  };
  protected readonly accountValue = (account: Account): string => account.id;
  protected readonly accountLabel = (account: Account): string => `${account.accountCode} - ${account.name}`;
  /** Resolves the display label of an id set externally (e.g. on load) via the accounts API. */
  protected readonly resolveAccountLabel = (id: string): Observable<string> =>
    this.accounts.get(id).pipe(map((account) => `${account.accountCode} - ${account.name}`));
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
    const needsDetail = item?.detailAccountId ? true : false;
    const group = new FormGroup<ItemForm>({
      subsidiaryAccountId: new FormControl<string | null>(item?.subsidiaryAccountId ?? null, Validators.required),
      detailAccountId: new FormControl<string | null>(item?.detailAccountId ?? null),
      subsidiaryNeedsDetail: new FormControl<boolean>(needsDetail, { nonNullable: true }),
      debit: new FormControl<number | null>(item?.debit ? toNonNegativeAmount(item.debit) : null, Validators.min(0)),
      credit: new FormControl<number | null>(item?.credit ? toNonNegativeAmount(item.credit) : null, Validators.min(0)),
      description: new FormControl(item?.description ?? '', { nonNullable: true }),
    });
    // Detail is required only when the chosen subsidiary accepts detail accounts.
    group.controls.detailAccountId.setValidators((control) =>
      group.controls.subsidiaryNeedsDetail.value && !control.value ? { detailRequired: true } : null,
    );
    if (!needsDetail) group.controls.detailAccountId.disable({ emitEvent: false });
    this.watchSubsidiary(group);
    this.watchAmount(group, 'debit');
    this.watchAmount(group, 'credit');
    return group;
  }

  /** When the subsidiary changes, toggle the detail requirement from its `isDetailAllowed` flag. */
  private watchSubsidiary(group: ItemGroup): void {
    group.controls.subsidiaryAccountId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((id) => {
      const account = id ? this.accountCache.get(id) : undefined;
      const needsDetail = account?.isDetailAllowed ?? false;
      group.controls.subsidiaryNeedsDetail.setValue(needsDetail);
      const detail = group.controls.detailAccountId;
      if (needsDetail) {
        detail.enable({ emitEvent: false });
      } else {
        detail.setValue(null, { emitEvent: false });
        detail.disable({ emitEvent: false });
      }
      detail.updateValueAndValidity();
    });
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
      this.state.set(journal.state);
      this.postedNumber.set(journal.postedNumber ?? null);
      this.postedByUser.set(journal.postedByUser ?? null);
      this.postedDate.set(journal.postedDate ?? null);
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
      this.accountCache.clear();
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
          subsidiaryAccountId: raw.subsidiaryAccountId as string,
          detailAccountId: raw.subsidiaryNeedsDetail ? raw.detailAccountId : null,
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

  /** Finalise a draft journal, but only after the user confirms. */
  protected askPost(): void {
    if (!this.isDraft() || this.busy()) return;
    this.postOpen.set(true);
  }

  protected async confirmPost(): Promise<void> {
    const id = this.journalId();
    if (!id || !this.isDraft()) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.journals.post(id));
      this.postOpen.set(false);
      this.state.set(JournalState.Posted);
      this.disableForm();
      this.notify.success('سند قطعی شد.');
      // Pull the finalisation details (number / user / date) the server has just assigned.
      await this.load(id);
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.busy.set(false);
    }
  }
}
