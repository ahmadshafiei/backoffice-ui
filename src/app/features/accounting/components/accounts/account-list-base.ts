import { Directive, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationApi } from '../../../../core/services/notification-api';
import { toEnDigits } from '../../../../shared/utils/digits.utils';
import { ACCOUNT_LEVEL_LABEL, Account, AccountLevel } from '../../models/account.model';
import { AccountService } from '../../services/account.service';

/** State and behaviour common to the group / general / subsidiary account list pages. */
@Directive()
export abstract class AccountListBase {
  protected abstract readonly level: AccountLevel;

  private readonly accounts = inject(AccountService);
  private readonly notify = inject(NotificationApi);

  protected readonly rows = signal<readonly Account[]>([]);
  protected readonly total = signal(0);
  protected readonly loading = signal(false);

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
    effect(() => {
      const pageNumber = this.page();
      const pageSize = this.pageSize();
      const name = toEnDigits(this.search()).trim();
      untracked(() => void this.load(pageNumber, pageSize, name));
    });
  }

  protected async reload(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return this.load(this.page(), this.pageSize(), toEnDigits(this.search()).trim());
  }

  private async load(pageNumber: number, pageSize: number, name: string): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.accounts.list({ accountLevel: this.level, pageNumber, pageSize, name: name || undefined }),
      );
      this.rows.set(res.items);
      this.total.set(Number(res.totalCount));
    } catch {
      /* surfaced by the interceptor */
    } finally {
      this.loading.set(false);
    }
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
      await firstValueFrom(this.accounts.remove(account.id));
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
