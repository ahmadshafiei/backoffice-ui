import { Injectable, effect, signal } from '@angular/core';

const KEY = 'backoffice.sidebar.collapsed';
const MOBILE_QUERY = '(max-width: 900px)';

/** Sidebar state: collapsed rail on desktop, off-canvas drawer on small screens. */
@Injectable({ providedIn: 'root' })
export class LayoutStore {
  private readonly mql = matchMedia(MOBILE_QUERY);

  readonly collapsed = signal(read());
  readonly drawerOpen = signal(false);
  readonly isMobile = signal(this.mql.matches);

  constructor() {
    this.mql.addEventListener('change', (e) => {
      this.isMobile.set(e.matches);
      if (!e.matches) this.drawerOpen.set(false);
    });
    effect(() => {
      try { localStorage.setItem(KEY, String(this.collapsed())); } catch { /* storage unavailable */ }
    });
  }

  toggleNav(): void {
    if (this.isMobile()) this.drawerOpen.update((o) => !o);
    else this.collapsed.update((c) => !c);
  }

  setCollapsed(value: boolean): void { this.collapsed.set(value); }
  closeDrawer(): void { this.drawerOpen.set(false); }
}

function read(): boolean {
  try { return localStorage.getItem(KEY) === 'true'; } catch { return false; }
}
