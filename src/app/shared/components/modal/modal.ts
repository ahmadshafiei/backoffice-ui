import { ChangeDetectionStrategy, Component, ElementRef, effect, input, model, viewChild } from '@angular/core';
import { Icon } from '../icon/icon';

/** Accessible modal built on the native <dialog> (focus trap, Esc, inert background come for free). */
@Component({
  selector: 'app-modal',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog [style.--modal-w]="width()" [attr.aria-labelledby]="'modal-title-' + uid"
      (close)="open.set(false)" (click)="onBackdropClick($event)">
      <div class="surface">
        <header>
          <h2 [id]="'modal-title-' + uid">{{ title() }}</h2>
          <button type="button" class="icon-btn" aria-label="بستن" (click)="open.set(false)"><app-icon name="x" [size]="18" /></button>
        </header>
        <div class="body"><ng-content /></div>
        <footer><ng-content select="[modalFooter]" /></footer>
      </div>
    </dialog>
  `,
  styleUrl: './modal.css',
})
export class Modal {
  private static next = 0;
  protected readonly uid = Modal.next++;

  readonly open = model(false);
  readonly title = input.required<string>();
  readonly width = input('520px');
  /** Disable for forms so a stray click outside does not discard input. */
  readonly closeOnBackdrop = input(true);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.open() && !el.open) el.showModal();
      else if (!this.open() && el.open) el.close();
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    // The <dialog> itself is the click target only when the ::backdrop was clicked.
    if (this.closeOnBackdrop() && event.target === this.dialog().nativeElement) this.open.set(false);
  }
}
