import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Farabi Financial Group wordmark. Inline so its colours can follow the light/dark theme. */
@Component({
  selector: 'app-brand-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--logo-h.px]': 'height()' },
  templateUrl: './brand-logo.html',
  styles: `
    :host { display: inline-flex; }
    .logo { height: var(--logo-h, 32px); width: auto; display: block; }
    .ink { fill: var(--logo-ink); }
    .mark { fill: var(--logo-mark); }
  `,
})
export class BrandLogo {
  readonly height = input(32);
}
