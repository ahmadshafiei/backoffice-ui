import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { Modal } from './modal';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Modal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [(open)]="open" [title]="title()" width="440px">
      <p class="message">{{ message() }}</p>
      <ng-container modalFooter>
        <button type="button" class="btn" [class.btn-danger]="danger()" [class.btn-primary]="!danger()" [disabled]="busy()" (click)="confirmed.emit()">
          {{ confirmLabel() }}
        </button>
        <button type="button" class="btn" [disabled]="busy()" (click)="open.set(false)">انصراف</button>
      </ng-container>
    </app-modal>
  `,
  styles: `.message { line-height: 1.9; color: var(--ink-2); }`,
})
export class ConfirmDialog {
  readonly open = model(false);
  readonly title = input('تأیید عملیات');
  readonly message = input.required<string>();
  readonly confirmLabel = input('تأیید');
  readonly danger = input(false);
  readonly busy = input(false);
  readonly confirmed = output<void>();
}
