import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { ProfileModel } from '@features/profile/domain/models/profile.model';
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '@features/profile/domain/requests/update-profile.request';
import { PROFILE_API_CONFIG } from '@features/profile/infrastructure/config/profile-api.config';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi extends BaseFeatureApi {
  constructor(http: HttpClient) {
    super(http, PROFILE_API_CONFIG.base);
  }

  getMyProfile(): Observable<ApiResponseModel<ProfileModel>> {
    return this.get<ProfileModel>(this.buildUrl(PROFILE_API_CONFIG.endpoints.me));
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponseModel<ProfileModel>> {
    return this.patch<ProfileModel>(this.buildUrl(PROFILE_API_CONFIG.endpoints.update), data);
  }

  changePassword(data: ChangePasswordRequest): Observable<ApiResponseModel<void>> {
    return this.patch<void>(this.buildUrl(PROFILE_API_CONFIG.endpoints.changePassword), data);
  }

  uploadAvatar(file: File): Observable<ApiResponseModel<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.patch<ApiResponseModel<{ avatarUrl: string }>>(
      this.buildUrl(PROFILE_API_CONFIG.endpoints.uploadAvatar),
      formData,
    );
  }
}
