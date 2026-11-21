import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, computed, inject, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription, catchError, debounceTime, map, of } from 'rxjs';
import { FloatingPosition, floatingPosition } from '../../utils/floating.util';
import { Icon } from '../icon/icon';

let nextSearchSelectId = 0;

const DEFAULT_DEBOUNCE_MS = 300;
const MENU_MAX_HEIGHT = 240;

/**
 * Generic type-ahead dropdown (combobox).
 *
 * Data-agnostic: the parent supplies a `search` function (usually backed by an API) and tells the
 * component how to read the value and label of each item. It is a `ControlValueAccessor`, so it
 * works with `formControlName` / `formControl` and supports `disabled`.
 */
@Component({
  selector: 'app-search-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: SearchSelect, multi: true }],
  imports: [Icon],
  template: `
    <div class="field" [class.invalid]="!!error()">
      @if (label()) {
        <label class="label" [attr.for]="id">{{ label() }}@if (required()) {<span class="req" aria-hidden="true"> *</span>}</label>
      }
      <div class="picker" #anchor>
        <input class="control" [id]="id" type="text" autocomplete="off" role="combobox"
          [value]="displayText()" [disabled]="disabled()" [readOnly]="!searchable()"
          [attr.placeholder]="placeholder()" [attr.aria-invalid]="error() ? 'true' : null"
          [attr.aria-expanded]="open()" [attr.aria-autocomplete]="searchable() ? 'list' : null"
          [attr.aria-controls]="id + '-listbox'" [attr.aria-describedby]="describedBy()"
          (focus)="onFocus()" (input)="onInput($event)" (keydown)="onKeydown($event)" />
        @if (clearable() && value() && !disabled()) {
          <button type="button" class="clear" aria-label="پاک کردن انتخاب" (click)="clear($event)">
            <app-icon name="x" [size]="14" />
          </button>
        }
        @if (open()) {
          <ul class="menu" role="listbox" [id]="id + '-listbox'"
            [style.top.px]="menuPosition().top" [style.left.px]="menuPosition().left"
            [style.width.px]="menuPosition().width" [style.maxHeight.px]="menuPosition().maxHeight"
            [style.transform]="menuPosition().above ? 'translateY(-100%)' : 'none'">
            @if (loading()) {
              <li class="hint">در حال بارگذاری…</li>
            } @else if (options().length === 0) {
              <li class="hint">{{ emptyText() }}</li>
            } @else {
              @for (option of options(); track optionValue()(option); let i = $index) {
                <li role="option" [class.active]="i === activeIndex()" [attr.aria-selected]="optionValue()(option) === value()"
                  (mouseenter)="activeIndex.set(i)" (click)="pick(option)">
                  @if (optionParts(option); as parts) {
                    <span class="code">{{ parts.code }}</span>
                    <span class="name">{{ parts.name }}</span>
                  } @else {
                    <span class="name">{{ optionLabel()(option) }}</span>
                  }
                </li>
              }
            }
          </ul>
        }
      </div>
      @if (error()) {
        <p class="msg error" [id]="id + '-msg'" role="alert">{{ error() }}</p>
      } @else if (hint()) {
        <p class="msg hint" [id]="id + '-msg'">{{ hint() }}</p>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .picker { position: relative; }
    .picker .control { padding-inline-end: 30px; }
    .clear {
      position: absolute; inset-inline-end: 6px; top: 50%; transform: translateY(-50%);
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px; padding: 0; border: 0; border-radius: var(--radius-control);
      background: transparent; color: var(--ink-3); cursor: pointer;
    }
    .clear:hover { background: var(--surface-2); color: var(--ink); }
    .menu {
      position: fixed; z-index: 20;
      margin: 0; padding: 4px; list-style: none; overflow-y: auto;
      border: 1px solid var(--line); border-radius: var(--radius-panel); background: var(--surface); box-shadow: var(--shadow-float);
    }
    .menu li {
      display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: var(--radius-control);
      cursor: pointer; font-size: 13px;
    }
    .menu li:hover, .menu li.active { background: var(--surface-2); }
    .menu .code { font-variant-numeric: tabular-nums; color: var(--ink-3); white-space: nowrap; }
    .menu .name { color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .menu .hint { color: var(--ink-3); justify-content: center; cursor: default; }
  `,
})
export class SearchSelect<T> implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly anchor = viewChild.required<ElementRef<HTMLElement>>('anchor');

  /** Runs the search for a typed term; an empty string asks for the initial list. */
  readonly search = input.required<(term: string) => Observable<readonly T[]>>();
  readonly optionValue = input.required<(item: T) => string>();
  readonly optionLabel = input.required<(item: T) => string>();
  /** Resolves the display label of a value set externally (no matching option at hand), e.g. on form load. */
  readonly resolveLabel = input<((value: string) => Observable<string>) | null>(null);
  /** Splits a label into "code" and "name" parts for the menu; defaults to the whole label. */
  readonly splitLabel = input<((label: string) => { code: string; name: string } | null) | null>(null);

  readonly label = input('');
  readonly placeholder = input('جستجو…');
  readonly emptyText = input('موردی یافت نشد.');
  readonly hint = input('');
  /** Visual "required" marker only – add `Validators.required` on the control itself. */
  readonly required = input(false);
  readonly clearable = input(false);
  readonly debounceMs = input(DEFAULT_DEBOUNCE_MS);

  readonly id = `search-select-${nextSearchSelectId++}`;

  protected readonly value = signal<string | null>(null);
  protected readonly disabled = signal(false);
  protected readonly open = signal(false);
  protected readonly loading = signal(false);
  protected readonly options = signal<readonly T[]>([]);
  protected readonly selectedLabel = signal('');
  protected readonly searchText = signal('');
  protected readonly activeIndex = signal(-1);
  protected readonly error = signal('');
  protected readonly menuPosition = signal<FloatingPosition>({ top: 0, left: 0, width: 0, maxHeight: MENU_MAX_HEIGHT, above: false });

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};
  private searchSub?: Subscription;
  private labelSub?: Subscription;
  private viewportCleanup: (() => void) | null = null;

  /** Free text is only shown while the user types; otherwise the selected label wins. */
  protected readonly displayText = computed(() =>
    this.open() && this.searchText() !== '' ? this.searchText() : this.selectedLabel(),
  );

  /** Read-only until focused, so an externally assigned value is not overwritten by stray typing. */
  protected readonly searchable = computed(() => this.open());

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.searchSub?.unsubscribe();
      this.labelSub?.unsubscribe();
      this.stopListeningToViewport();
    });
  }

  writeValue(value: string | null): void {
    const next = value ?? null;
    const previous = this.value();
    this.value.set(next);
    this.searchText.set('');
    if (!next) {
      this.selectedLabel.set('');
      return;
    }
    if (next === previous && this.selectedLabel()) return;
    const matched = this.options().find((option) => this.optionValue()(option) === next);
    if (matched) {
      this.selectedLabel.set(this.optionLabel()(matched));
      return;
    }
    this.resolveLabelFor(next);
  }

  registerOnChange(fn: (value: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) this.close();
  }

  protected describedBy(): string | null {
    return this.error() || this.hint() ? `${this.id}-msg` : null;
  }

  protected optionParts(option: T): { code: string; name: string } | null {
    const split = this.splitLabel();
    return split ? split(this.optionLabel()(option)) : null;
  }

  protected onFocus(): void {
    if (this.disabled() || this.open()) return;
    this.open.set(true);
    this.positionMenu();
    this.listenToViewport();
    this.runSearch('');
  }

  protected onInput(event: Event): void {
    if (this.disabled()) return;
    const raw = (event.target as HTMLInputElement).value;
    this.open.set(true);
    this.searchText.set(raw);
    this.positionMenu();
    this.listenToViewport();
    this.runSearch(raw.trim());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const last = this.options().length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open()) this.onFocus();
        else this.activeIndex.set(last < 0 ? -1 : Math.min(this.activeIndex() + 1, last));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
        break;
      case 'Enter': {
        if (!this.open()) return;
        event.preventDefault();
        const index = Math.max(0, this.activeIndex());
        const option = this.options()[index];
        if (option !== undefined) this.pick(option);
        break;
      }
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  protected pick(option: T): void {
    const value = this.optionValue()(option);
    this.value.set(value);
    this.selectedLabel.set(this.optionLabel()(option));
    this.searchText.set('');
    this.activeIndex.set(-1);
    this.close();
    this.onChange(value);
    this.onTouched();
  }

  protected clear(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled() || !this.clearable()) return;
    this.value.set(null);
    this.selectedLabel.set('');
    this.searchText.set('');
    this.activeIndex.set(-1);
    this.onChange(null);
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (this.host.nativeElement.contains(event.target as Node)) return;
    this.close();
    this.searchText.set('');
  }

  private runSearch(term: string): void {
    this.searchSub?.unsubscribe();
    this.loading.set(true);
    this.activeIndex.set(-1);
    this.searchSub = this.search()(term)
      .pipe(
        debounceTime(this.debounceMs()),
        catchError(() => of([] as readonly T[])),
        map((items) => items ?? []),
      )
      .subscribe((items) => {
        this.options.set(items);
        this.loading.set(false);
        if (this.open()) this.positionMenu();
      });
  }

  private resolveLabelFor(value: string): void {
    this.labelSub?.unsubscribe();
    const resolve = this.resolveLabel();
    if (!resolve) {
      this.selectedLabel.set(value);
      return;
    }
    this.selectedLabel.set('');
    this.labelSub = resolve(value)
      .pipe(catchError(() => of(value)))
      .subscribe((label) => {
        if (this.value() === value) this.selectedLabel.set(label);
      });
  }

  private close(): void {
    this.open.set(false);
    this.stopListeningToViewport();
  }

  private positionMenu(): void {
    const view = this.host.nativeElement.ownerDocument.defaultView;
    if (!view) return;
    const anchor = this.anchor().nativeElement.getBoundingClientRect();
    this.menuPosition.set(floatingPosition(anchor, view.innerWidth, view.innerHeight, anchor.width, MENU_MAX_HEIGHT, MENU_MAX_HEIGHT));
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
}
