import { VerifyLoginTwoFactorDto } from '@modules/auth/application/dto/requests/verify-login-two-factor.dto';

export class VerifyLoginTwoFactorCommand {
  constructor(public readonly dto: VerifyLoginTwoFactorDto) {}
}
