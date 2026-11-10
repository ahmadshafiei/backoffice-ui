import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { Icon } from '../icon/icon';
import { MenuGroup } from './menu.model';

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

  /** The group that contains the current route is open unless the user explicitly closed it. */
  protected readonly activeGroupId = computed(() => {
    const url = this.url();
    return this.groups().find((g) => g.children?.some((c) => url.startsWith(c.path)))?.id ?? null;
  });

  protected isOpen(group: MenuGroup): boolean {
    if (this.manuallyClosed().has(group.id)) return false;
    return this.manuallyOpen().has(group.id) || this.activeGroupId() === group.id;
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
      this.manuallyClosed.update((s) => without(s, group.id));
      this.manuallyOpen.update((s) => new Set(s).add(group.id));
    }
  }
}

function without(set: ReadonlySet<string>, id: string): ReadonlySet<string> {
  const next = new Set(set);
  next.delete(id);
  return next;
}
