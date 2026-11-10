import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from './shared/components/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Notification],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet /><app-notification />`,
})
export class App {}
