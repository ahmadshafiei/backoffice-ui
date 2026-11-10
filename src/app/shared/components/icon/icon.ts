import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS, IconName } from './icons';

/** Inline SVG icon (lucide set). Size follows `size` (px) and colour follows `currentColor`. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--icon-size.px]': 'size()', '[class.flip]': 'flip()' },
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" [innerHTML]="markup()"></svg>`,
  styles: `
    :host { display: inline-flex; flex: none; width: var(--icon-size, 18px); height: var(--icon-size, 18px); }
    svg { width: 100%; height: 100%; }
    /* Directional icons (arrows/chevrons) mirror in RTL layouts. */
    :host(.flip) svg { transform: scaleX(-1); }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  /** Mirror horizontally – use for chevrons/arrows that point along the reading direction. */
  readonly flip = input(false);

  private readonly sanitizer = inject(DomSanitizer);
  // ICONS is a static, first-party constant, so trusting it is safe.
  protected readonly markup = computed(() => this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()]));
}
