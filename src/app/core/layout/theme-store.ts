import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const KEY = 'backoffice.theme';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly theme = signal<Theme>(initial());

  constructor() {
    effect(() => {
      const theme = this.theme();
      document.documentElement.dataset['theme'] = theme;
      try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable */ }
    });
  }

  toggle(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}

function initial(): Theme {
  const fromDom = document.documentElement.dataset['theme'];
  return fromDom === 'dark' ? 'dark' : 'light';
}
