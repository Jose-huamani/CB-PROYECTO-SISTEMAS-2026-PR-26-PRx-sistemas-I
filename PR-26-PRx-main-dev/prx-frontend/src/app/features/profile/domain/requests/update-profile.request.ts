export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  secondLastName?: string | null;
  biography?: string | null;
  phoneNumber?: string | null;
  phoneCodeId?: number | null;
  isEmailVisible?: boolean;
  countryId?: number | null;
  regionName?: string | null;
  townName?: string | null;
  socialNetworks?: UpdateProfileSocialNetworkRequest[];
  tags?: string[];
}

export interface UpdateProfileSocialNetworkRequest {
  socialNetworkId: number;
  username: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
