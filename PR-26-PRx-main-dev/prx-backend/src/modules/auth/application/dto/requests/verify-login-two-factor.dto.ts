import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class VerifyLoginTwoFactorDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty({ message: 'El identificador de verificación es obligatorio' })
  @IsString()
  @IsUUID('all', { message: 'El identificador de verificación no es válido' })
  challengeId!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser un texto' })
  @Length(6, 6, {
    message: 'El código debe tener exactamente 6 caracteres',
  })
  @Matches(/^\d{6}$/, {
    message: 'El código debe contener solo números',
  })
  code!: string;
}
