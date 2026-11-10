import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { NotificationApi } from '../../../core/services/notification-api';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-notification',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  protected readonly api = inject(NotificationApi);
  private readonly stack = viewChild<ElementRef<HTMLElement>>('stack');


  constructor() {
    effect(() => {
      const hasToasts = this.api.toasts().length > 0;

      const el = this.stack()?.nativeElement;

      if (!el) return;

      if (typeof el.showPopover !== 'function') return;

      if (hasToasts) {
        if (el.matches(':popover-open')) el.hidePopover();
        el.showPopover();
      } else if (el.matches(':popover-open')) {
        el.hidePopover();
      }
    });
  }
}
