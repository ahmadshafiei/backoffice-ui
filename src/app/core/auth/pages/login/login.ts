import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandLogo } from '../../../../shared/components/brand-logo/brand-logo';
import { TextField } from '../../../../shared/components/fields/text-field';
import { NotificationApi } from '../../../services/notification-api';
import { AuthStore } from '../../auth-store';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TextField, BrandLogo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notify = inject(NotificationApi);

  protected readonly busy = signal(false);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.busy.set(true);
    try {
      await this.auth.login(this.form.getRawValue());
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl && returnUrl.startsWith('/') ? returnUrl : '/');
    } catch (e) {
      this.notify.error(e instanceof Error ? e.message : 'ورود انجام نشد.');
    } finally {
      this.busy.set(false);
    }
  }
}
