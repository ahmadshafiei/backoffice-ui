import { Directive, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { toEnDigits } from '../../../../shared/utils/digits.utils';
import { ACCOUNT_LEVEL_LABEL, Account, AccountLevel } from '../../accounting.model';
import { AccountingApi } from '../../accounting-api';

/** State and behaviour common to the group / general / subsidiary account list pages. */
@Directive()
export abstract class AccountListBase {
  protected abstract readonly level: AccountLevel;

  private readonly api = inject(AccountingApi);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly Account[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);
  protected readonly parents = signal<readonly Account[]>([]);
  protected readonly parentById = computed(() => new Map(this.parents().map((a) => [a.id, a] as const)));

  protected readonly search = signal('');
  /** Jumps back to page 1 whenever the search text changes. */
  protected readonly page = linkedSignal({ source: this.search, computation: () => 1 });
  protected readonly pageSize = signal(10);

  protected readonly formOpen = signal(false);
  protected readonly editing = signal<Account | null>(null);
  protected readonly deleteOpen = signal(false);
  protected readonly deleting = signal<Account | null>(null);
  protected readonly busy = signal(false);

  protected readonly rowKey = (account: Account): string => account.id;
  protected readonly noun = computed(() => ACCOUNT_LEVEL_LABEL[this.level]);

  constructor() {
    void this.loadParents();

    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      const name = toEnDigits(this.search()).trim();
      untracked(() => void this.load(pageNumber, pageSize, name));
    });
  }

  protected reload(): Promise<void> {
    return this.load(this.page(), this.pageSize(), toEnDigits(this.search()).trim());
  }

  private async load(pageNumber: number, pageSize: number, name: string): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.api.listAccounts({ accountLevel: this.level, pageNumber, pageSize, name: name || undefined }),
      );
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
  }

  private async loadParents(): Promise<void> {
    if (this.level === AccountLevel.Group) return;
    const parentLevel = this.level === AccountLevel.General ? AccountLevel.Group : AccountLevel.General;
    try {
      this.parents.set(await firstValueFrom(this.api.allAccounts(parentLevel)));
    } catch {
      /* surfaced by the interceptor */
    }
  }

  protected parentName(account: Account): string {
    return (account.parentId && this.parentById().get(account.parentId)?.name) || '—';
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  protected openEdit(account: Account): void {
    this.editing.set(account);
    this.formOpen.set(true);
  }

  protected askDelete(account: Account): void {
    this.deleting.set(account);
    this.deleteOpen.set(true);
  }

  protected async confirmDelete(): Promise<void> {
    const account = this.deleting();
    if (!account) return;
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.deleteAccount(account.id));
      this.notify.success(`«${account.name}» حذف شد.`);
      this.deleteOpen.set(false);
      if (this.rows().length === 1 && this.page() > 1) this.page.update((p) => p - 1);
      else await this.reload();
    } catch {
      /* the interceptor already showed the server's reason */
    } finally {
      this.busy.set(false);
    }
  }
}
