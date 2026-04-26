import { ConfirmRegisterDto } from '@modules/auth/application/dto/requests/confirm-register.dto';

export class ConfirmRegisterCommand {
  constructor(
    public readonly dto: ConfirmRegisterDto,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
  ) {}
}
