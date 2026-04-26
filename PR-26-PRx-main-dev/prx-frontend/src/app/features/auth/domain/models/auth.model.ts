import { CurrentUserModel } from '@shared/models/current-user.model';

export interface AuthModel {
  accessToken: string;
  refreshToken: string;
  user: CurrentUserModel;
}

/** Respuesta del paso 1 de login: contraseña correcta, falta código por correo. */
export interface LoginTwoFactorPendingModel {
  twoFactorRequired: true;
  challengeId: string;
}

export type LoginResultModel = AuthModel | LoginTwoFactorPendingModel;

export function isLoginTwoFactorPending(
  data: LoginResultModel | undefined | null,
): data is LoginTwoFactorPendingModel {
  return !!data && 'twoFactorRequired' in data && data.twoFactorRequired === true;
}
