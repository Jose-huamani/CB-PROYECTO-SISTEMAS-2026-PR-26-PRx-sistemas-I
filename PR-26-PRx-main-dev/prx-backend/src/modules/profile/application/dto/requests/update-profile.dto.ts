import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdateProfileSocialNetworkDto {
  @IsInt()
  socialNetworkId: number;

  @IsString()
  @MaxLength(255)
  username: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  firstName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lastName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  secondLastName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  biography?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string | null;

  @IsOptional()
  @IsInt()
  phoneCodeId?: number | null;

  @IsOptional()
  @IsBoolean()
  isEmailVisible?: boolean;

  @IsOptional()
  @IsInt()
  countryId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  regionName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  townName?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProfileSocialNetworkDto)
  socialNetworks?: UpdateProfileSocialNetworkDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
