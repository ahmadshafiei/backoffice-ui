import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { Icon } from '../icon/icon';
import { MenuGroup, MenuLeaf } from './menu.model';

/** Collapsible, accordion-style navigation menu. Collapsed mode shows an icon rail. */
@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  readonly groups = input.required<readonly MenuGroup[]>();
  readonly collapsed = input(false);
  /** Emitted after a link is followed (lets a mobile drawer close itself). */
  readonly navigated = output<void>();
  /** Emitted when a group icon is clicked while the rail is collapsed. */
  readonly expandRequested = output<void>();

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), map((e) => e.urlAfterRedirects)),
    { initialValue: this.router.url },
  );

  private readonly manuallyOpen = signal<ReadonlySet<string>>(new Set());
  private readonly manuallyClosed = signal<ReadonlySet<string>>(new Set());
  private readonly manuallyOpenSub = signal<ReadonlySet<string>>(new Set());
  private readonly manuallyClosedSub = signal<ReadonlySet<string>>(new Set());

  /** The group that contains the current route is open unless the user explicitly closed it. */
  protected readonly activeGroupId = computed(() => {
    const url = this.url();
    return this.groups().find((g) => g.children?.some((c) => this.matches(c, url)))?.id ?? null;
  });

  protected isOpen(group: MenuGroup): boolean {
    if (this.manuallyClosed().has(group.id)) return false;
    return this.manuallyOpen().has(group.id) || this.activeGroupId() === group.id;
  }

  protected isSubOpen(groupId: string, child: MenuLeaf): boolean {
    const key = `${groupId}/${child.label}`;
    if (this.manuallyClosedSub().has(key)) return false;
    return this.manuallyOpenSub().has(key) || this.matches(child, this.url());
  }

  protected toggleSub(groupId: string, child: MenuLeaf): void {
    const key = `${groupId}/${child.label}`;
    if (this.isSubOpen(groupId, child)) {
      this.manuallyOpenSub.update((s) => without(s, key));
      this.manuallyClosedSub.update((s) => new Set(s).add(key));
    } else {
      this.manuallyClosedSub.update((s) => without(s, key));
      this.manuallyOpenSub.update((s) => new Set(s).add(key));
    }
  }

  private matches(leaf: MenuLeaf, url: string): boolean {
    if (leaf.path && (url === leaf.path || url.startsWith(`${leaf.path}/`) || url.startsWith(`${leaf.path}?`))) return true;
    return !!leaf.children?.some((child) => this.matches(child, url));
  }

  protected toggle(group: MenuGroup): void {
    if (this.collapsed()) {
      this.manuallyClosed.update((s) => without(s, group.id));
      this.manuallyOpen.update((s) => new Set(s).add(group.id));
      this.expandRequested.emit();
      return;
    }
    if (this.isOpen(group)) {
      this.manuallyOpen.update((s) => without(s, group.id));
      this.manuallyClosed.update((s) => new Set(s).add(group.id));
    } else {
      const openId = group.id;
      this.manuallyOpen.set(new Set([openId]));
      this.manuallyClosed.set(new Set(this.groups().map((g) => g.id).filter((id) => id !== openId)));
    }
  }
}

function without(set: ReadonlySet<string>, id: string): ReadonlySet<string> {
  const next = new Set(set);
  next.delete(id);
  return next;
}
