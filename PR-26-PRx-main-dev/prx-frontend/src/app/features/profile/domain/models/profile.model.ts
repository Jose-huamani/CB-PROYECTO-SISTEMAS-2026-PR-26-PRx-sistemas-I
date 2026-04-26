export interface ProfileSocialNetworkModel {
  socialNetworkId: number;
  socialNetworkName: string;
  username: string;
}

export interface ProfileTagModel {
  tagId: number;
  tagName: string;
}

export interface ProfileModel {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  biography: string | null;
  phoneNumber: string | null;
  phoneCodeId: number | null;
  phoneCode: string | null;
  isEmailVisible: boolean;
  countryId: number | null;
  countryName: string | null;
  regionId: number | null;
  regionName: string | null;
  townId: number | null;
  townName: string | null;
  socialNetworks: ProfileSocialNetworkModel[];
  tags: ProfileTagModel[];
}
