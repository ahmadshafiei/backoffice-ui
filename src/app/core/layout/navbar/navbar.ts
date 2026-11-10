import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandLogo } from '../../../shared/components/brand-logo/brand-logo';
import { Icon } from '../../../shared/components/icon/icon';
import { AuthStore } from '../../auth/auth-store';
import { LayoutStore } from '../layout-store';
import { ThemeStore } from '../theme-store';

@Component({
  selector: 'app-navbar',
  imports: [Icon, BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly layout = inject(LayoutStore);
  protected readonly themeStore = inject(ThemeStore);
  protected readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly initial = computed(() => this.auth.user()?.fullName.trim().charAt(0) ?? '');

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/auth/login']);
  }
}
