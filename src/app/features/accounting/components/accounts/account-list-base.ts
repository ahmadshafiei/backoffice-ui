import { Directive, computed, inject, linkedSignal, signal } from '@angular/core';
import { NotificationApi } from '../../../../core/services/notification-api';
import { pageCount, paginate } from '../../../../shared/utils/array.utils';
import { toEnDigits } from '../../../../shared/utils/digits.utils';
import { ACCOUNT_LEVEL_LABEL, Account, AccountLevel } from '../../accounting.model';
import { AccountsStore } from '../../accounts-store';

/** State and behaviour common to the group / general / subsidiary account list pages. */
@Directive()
export abstract class AccountListBase {
  protected abstract readonly level: AccountLevel;

  protected readonly store = inject(AccountsStore);
  private readonly notify = inject(NotificationApi);

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

  protected readonly filtered = computed(() => {
    const term = toEnDigits(this.search()).trim().toLowerCase();
    const rows = this.store.accounts().filter((a) => a.accountLevel === this.level);
    return term ? rows.filter((a) => a.name.toLowerCase().includes(term) || a.accountCode.includes(term)) : rows;
  });
  protected readonly pageRows = computed(() => paginate(this.filtered(), this.page(), this.pageSize()));

  constructor() {
    void this.store.load();
  }

  protected parentName(account: Account): string {
    return (account.parentId && this.store.byId().get(account.parentId)?.name) || '—';
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
      await this.store.remove(account.id);
      this.notify.success(`«${account.name}» حذف شد.`);
      this.deleteOpen.set(false);
      this.page.update((p) => Math.min(p, pageCount(this.filtered().length, this.pageSize())));
    } catch {
      /* the interceptor already showed the server's reason */
    } finally {
      this.busy.set(false);
    }
  }
}
