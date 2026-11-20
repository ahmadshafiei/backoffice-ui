import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, computed, inject, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FloatingPosition, floatingPosition } from '../../../../shared/utils/floating.util';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';

let nextPickerId = 0;


@Component({
  selector: 'app-account-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AccountPicker, multi: true }],
  template: `
    <div class="field" [class.invalid]="!!error()">
      @if (label()) {
        <label class="label" [attr.for]="id">{{ label() }}@if (required()) {<span class="req" aria-hidden="true"> *</span>}</label>
      }
      <div class="picker" #anchor>
        <input class="control" [id]="id" type="text" autocomplete="off"
          [value]="open() ? searchText() : (selectedLabel() || searchText())" [disabled]="disabled()"
          [attr.placeholder]="placeholder()" [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-expanded]="open()" aria-haspopup="listbox"
          (focus)="onFocus()" (input)="onInput($event)" />

        @if (open()) {
          <ul class="menu" role="listbox"
            [style.top.px]="menuPosition().top" [style.left.px]="menuPosition().left"
            [style.width.px]="menuPosition().width" [style.maxHeight.px]="menuPosition().maxHeight"
            [style.transform]="menuPosition().above ? 'translateY(-100%)' : 'none'">
            @if (loading()) {
              <li class="hint">در حال بارگذاری…</li>
            } @else if (options().length === 0) {
              <li class="hint">حسابی یافت نشد.</li>
            } @else {
              @for (account of options(); track account.id) {
                <li role="option" [attr.aria-selected]="account.id === value()" (click)="pick(account)">
                  <span class="code">{{ account.accountCode }}</span>
                  <span class="name">{{ account.name }}</span>
                </li>
              }
            }
          </ul>
        }
      </div>

      @if (error()) {
        <p class="msg error" [id]="id + '-msg'" role="alert">{{ error() }}</p>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .picker { position: relative; }
    .picker .control { padding-inline-end: 12px; }
    .selected {
      position: absolute; inset-inline-start: 10px; top: 50%; transform: translateY(-50%);
      max-width: calc(100% - 20px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-size: 12px; color: var(--ink-3); pointer-events: none; display: none;
    }
    .menu {
      position: fixed; z-index: 20;
      margin: 0; padding: 4px; list-style: none; max-height: 240px; overflow-y: auto;
      border: 1px solid var(--line); border-radius: var(--radius-panel); background: var(--surface); box-shadow: var(--shadow-float);
    }
    .menu li {
      display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: var(--radius-control);
      cursor: pointer; font-size: 13px;
    }
    .menu li:hover { background: var(--surface-2); }
    .menu .code { font-variant-numeric: tabular-nums; color: var(--ink-3); }
    .menu .name { color: var(--ink); }
    .menu .hint { color: var(--ink-3); justify-content: center; }
  `,
})
export class AccountPicker implements ControlValueAccessor {
  private readonly accounts = inject(AccountService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchor = viewChild.required<ElementRef<HTMLElement>>('anchor');

  readonly label = input('');
  readonly placeholder = input('جستجوی کد یا نام حساب');
  readonly required = input(false);

  readonly id = `account-picker-${nextPickerId++}`;

  private readonly onChangeFn = signal<(value: string | null) => void>(() => {});
  private readonly onTouchedFn = signal<() => void>(() => {});

  protected readonly value = signal<string | null>(null);
  protected readonly disabled = signal(false);
  protected readonly open = signal(false);
  protected readonly loading = signal(false);
  protected readonly options = signal<readonly Account[]>([]);
  protected readonly selectedLabel = signal('');
  protected readonly searchText = signal('');
  protected readonly error = signal('');
  protected readonly menuPosition = signal<FloatingPosition>({ top: 0, left: 0, width: 0, maxHeight: 240, above: false });

  private viewportCleanup: (() => void) | null = null;

  protected readonly accountName = computed(() => this.selectedLabel());

  private debounce?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopListeningToViewport());
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? null);
    this.searchText.set('');
    if (value) void this.resolveLabel(value);
    else this.selectedLabel.set('');
  }

  registerOnChange(fn: (value: string | null) => void): void { this.onChangeFn.set(fn); }
  registerOnTouched(fn: () => void): void { this.onTouchedFn.set(fn); }
  setDisabledState(isDisabled: boolean): void { this.disabled.set(isDisabled); }

  protected onFocus(): void {
    if (this.disabled()) return;
    this.open.set(true);
    this.positionMenu();
    this.listenToViewport();
    if (this.options().length === 0) void this.search('');
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.searchText.set(raw);
    this.open.set(true);
    this.positionMenu();
    this.listenToViewport();
    this.loading.set(true);
    if (this.debounce) clearTimeout(this.debounce);
    this.debounce = setTimeout(() => void this.search(raw.trim()), 350);
  }

  protected pick(account: Account): void {
    this.value.set(account.id);
    this.selectedLabel.set(`${account.accountCode} - ${account.name}`);
    this.searchText.set('');
    this.close();
    this.onChangeFn()(account.id);
    this.onTouchedFn()();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
      this.searchText.set('');
    }
  }

  private close(): void {
    this.open.set(false);
    this.stopListeningToViewport();
  }

  private positionMenu(): void {
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view) return;
    const anchor = this.anchor().nativeElement.getBoundingClientRect();
    this.menuPosition.set(floatingPosition(anchor, view.innerWidth, view.innerHeight, anchor.width, 240, 240));
  }

  private listenToViewport(): void {
    this.stopListeningToViewport();
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view) return;
    const update = () => { if (this.open()) this.positionMenu(); };
    view.addEventListener('resize', update);
    view.addEventListener('scroll', update, true);
    this.viewportCleanup = () => {
      view.removeEventListener('resize', update);
      view.removeEventListener('scroll', update, true);
    };
  }

  private stopListeningToViewport(): void {
    this.viewportCleanup?.();
    this.viewportCleanup = null;
  }

  private async search(searchExp: string): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.accounts.searchPostable({ searchExp: searchExp || undefined }));
      this.options.set(res.items ?? []);
    } catch {
      this.options.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private async resolveLabel(id: string): Promise<void> {
    try {
      const account = await firstValueFrom(this.accounts.get(id));
      this.selectedLabel.set(`${account.accountCode} - ${account.name}`);
    } catch {
      this.selectedLabel.set(id);
    }
  }
}