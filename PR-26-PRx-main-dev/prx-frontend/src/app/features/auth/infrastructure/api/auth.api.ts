import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { AuthApiContract } from '@features/auth/domain/contracts/auth-api.contract';
import { AuthModel, LoginResultModel } from '@features/auth/domain/models/auth.model';
import { ConfirmRegisterRequest } from '@features/auth/domain/requests/confirm-register.request';
import { ForgotPasswordRequest } from '@features/auth/domain/requests/forgot-password.request';
import { LoginRequest } from '@features/auth/domain/requests/login.request';
import { LogoutRequest } from '@features/auth/domain/requests/logout.request';
import { RefreshRequest } from '@features/auth/domain/requests/refresh.request';
import { RegisterRequestData } from '@features/auth/domain/requests/register-request.request';
import { ResendCodeRequest } from '@features/auth/domain/requests/resend-code.request';
import { ResetPasswordRequest } from '@features/auth/domain/requests/reset-password.request';
import { VerifyLoginTwoFactorRequest } from '@features/auth/domain/requests/verify-login-two-factor.request';
import { AUTH_API_CONFIG } from '@features/auth/infrastructure/config/auth-api.config';
import { CurrentUserModel } from '@shared/models/current-user.model';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi extends BaseFeatureApi implements AuthApiContract {
  constructor(http: HttpClient) {
    super(http, AUTH_API_CONFIG.base);
  }

  login(data: LoginRequest): Observable<ApiResponseModel<LoginResultModel>> {
    return this.post<LoginResultModel>(this.buildUrl(AUTH_API_CONFIG.endpoints.login), data);
  }

  verifyLoginTwoFactor(
    data: VerifyLoginTwoFactorRequest,
  ): Observable<ApiResponseModel<AuthModel>> {
    return this.post<AuthModel>(
      this.buildUrl(AUTH_API_CONFIG.endpoints.verifyLoginTwoFactor),
      data,
    );
  }

  registerRequest(data: RegisterRequestData): Observable<ApiResponseModel<void>> {
    return this.post<void>(this.buildUrl(AUTH_API_CONFIG.endpoints.registerRequest), data);
  }

  confirmRegister(data: ConfirmRegisterRequest): Observable<ApiResponseModel<AuthModel>> {
    return this.post<AuthModel>(this.buildUrl(AUTH_API_CONFIG.endpoints.confirmRegister), data);
  }

  resendVerificationCode(data: ResendCodeRequest): Observable<ApiResponseModel<void>> {
    return this.post<void>(this.buildUrl(AUTH_API_CONFIG.endpoints.resendVerificationCode), data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponseModel<void>> {
    return this.post<void>(this.buildUrl(AUTH_API_CONFIG.endpoints.forgotPassword), data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponseModel<void>> {
    return this.post<void>(this.buildUrl(AUTH_API_CONFIG.endpoints.resetPassword), data);
  }

  refresh(data: RefreshRequest): Observable<ApiResponseModel<AuthModel>> {
    return this.post<AuthModel>(this.buildUrl(AUTH_API_CONFIG.endpoints.refresh), data);
  }

  logout(data: LogoutRequest): Observable<ApiResponseModel<void>> {
    return this.post<void>(this.buildUrl(AUTH_API_CONFIG.endpoints.logout), data);
  }

  me(): Observable<ApiResponseModel<CurrentUserModel>> {
    return this.get<CurrentUserModel>(this.buildUrl(AUTH_API_CONFIG.endpoints.me));
  }
}
