import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AccountingApi } from './accounting-api';
import { Account, AccountLevel, ModifyAccountRequest, RegisterAccountRequest } from './accounting.model';

/**
 * Client-side cache of the whole chart of accounts, shared by the group / general / subsidiary
 * pages (a general account needs its group's name, a subsidiary its general's). Every mutation
 * reloads the list so the UI always reflects the server.
 */
@Injectable({ providedIn: 'root' })
export class AccountsStore {
  private readonly api = inject(AccountingApi);

  readonly accounts = signal<readonly Account[]>([]);
  readonly loading = signal(false);
  private readonly loaded = signal(false);
  private inflight: Promise<void> | null = null;

  readonly byId = computed(() => new Map(this.accounts().map((a) => [a.id, a] as const)));
  readonly groups = computed(() => this.ofLevel(AccountLevel.Group));
  readonly generals = computed(() => this.ofLevel(AccountLevel.General));
  readonly subsidiaries = computed(() => this.ofLevel(AccountLevel.Subsidiary));

  /** Loads once; pass `force` to refetch. Errors are toasted by the API interceptor. */
  load(force = false): Promise<void> {
    if (this.inflight) return this.inflight;
    if (this.loaded() && !force) return Promise.resolve();
    this.loading.set(true);
    this.inflight = firstValueFrom(this.api.listAllAccounts())
      .then((all) => {
        this.accounts.set(all.sort((a, b) => a.accountCode.localeCompare(b.accountCode, 'en', { numeric: true })));
        this.loaded.set(true);
      })
      .catch(() => { /* surfaced by the interceptor */ })
      .finally(() => { this.loading.set(false); this.inflight = null; });
    return this.inflight;
  }

  async register(body: RegisterAccountRequest): Promise<void> {
    await firstValueFrom(this.api.registerAccount(body));
    await this.load(true);
  }

  async modify(id: string, body: ModifyAccountRequest): Promise<void> {
    await firstValueFrom(this.api.modifyAccount(id, body));
    await this.load(true);
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteAccount(id));
    await this.load(true);
  }

  private ofLevel(level: AccountLevel): readonly Account[] {
    return this.accounts().filter((a) => a.accountLevel === level);
  }
}
