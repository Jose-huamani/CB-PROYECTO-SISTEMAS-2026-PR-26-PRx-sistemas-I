import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { buildVerifyLoginFormFields } from '@features/auth/application/forms/verify-login.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { normalizeVerificationCode } from '@shared/utils/verification-code.util';

@Component({
  selector: 'app-verify-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule],
  templateUrl: './verify-login-page.component.html',
  styleUrl: './verify-login-page.component.scss',
})
export class VerifyLoginPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildVerifyLoginFormFields();
  protected readonly submitting = signal(false);

  protected readonly challengeId = signal(
    this.route.snapshot.queryParamMap.get('challengeId') ?? '',
  );
  protected readonly hasChallenge = computed(() => !!this.challengeId());

  protected readonly verificationCodeExpiresMinutes =
    AUTH_CONSTANTS.VERIFICATION.EXPIRES_MINUTES;

  protected model: { code: string } = {
    code: '',
  };

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (!this.hasChallenge()) {
      this.notificationService.error('Acceso', AUTH_MESSAGES.VERIFY_LOGIN.ERROR);
      void this.router.navigate(['/auth/login']);
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
      return;
    }

    const raw = this.form.getRawValue() as { code?: string | number | null };
    const code = normalizeVerificationCode(raw.code);

    this.submitting.set(true);

    this.authFacade
      .verifyLoginTwoFactor({
        challengeId: this.challengeId(),
        code,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.notificationService.success(
            'Autenticación',
            getApiNotificationMessage(response, AUTH_MESSAGES.VERIFY_LOGIN.SUCCESS),
          );
          void this.router.navigateByUrl('/');
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.error(
            'Verificación',
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.VERIFY_LOGIN.ERROR),
          );
        },
      });
  }

  protected goBack(): void {
    void this.router.navigate(['/auth/login']);
  }
}
