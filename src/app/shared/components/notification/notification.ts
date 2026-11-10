import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
}
