import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProfileApi } from '@features/profile/infrastructure/api/profile.api';
import { ProfileModel } from '@features/profile/domain/models/profile.model';
import {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '@features/profile/domain/requests/update-profile.request';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacade {
  private readonly profileApi = inject(ProfileApi);

  getMyProfile(): Observable<ApiResponseModel<ProfileModel>> {
    return this.profileApi.getMyProfile();
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponseModel<ProfileModel>> {
    return this.profileApi.updateProfile(data);
  }

  changePassword(data: ChangePasswordRequest): Observable<ApiResponseModel<void>> {
    return this.profileApi.changePassword(data);
  }

  uploadAvatar(file: File): Observable<ApiResponseModel<{ avatarUrl: string }>> {
    return this.profileApi.uploadAvatar(file);
  }
}
