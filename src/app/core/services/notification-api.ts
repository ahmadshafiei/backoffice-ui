import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error' | 'info';

export interface Toast { id: number; kind: NotificationKind; message: string }

/** App-wide toast notifications. Rendered by <app-notification> in the root component. */
@Injectable({ providedIn: 'root' })
export class NotificationApi {
  private nextId = 0;
  readonly toasts = signal<readonly Toast[]>([]);

  success(message: string): void { this.push('success', message, 4000); }
  info(message: string): void { this.push('info', message, 4000); }
  error(message: string): void { this.push('error', message, 4000); }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(kind: NotificationKind, message: string, ttl: number): void {
    const id = this.nextId++;
    // Keep the stack short: drop the oldest beyond 4 and collapse exact duplicates.
    this.toasts.update((list) => [...list.filter((t) => t.message !== message), { id, kind, message }].slice(-4));
    setTimeout(() => this.dismiss(id), ttl);
  }
}
