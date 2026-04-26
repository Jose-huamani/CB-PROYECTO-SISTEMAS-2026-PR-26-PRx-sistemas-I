import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ChangePasswordDto } from '@modules/profile/application/dto/requests/change-password.dto';
import { UpdateProfileDto } from '@modules/profile/application/dto/requests/update-profile.dto';
import { ProfileService } from '@modules/profile/application/profile.service';

import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMyProfile(@CurrentUser('sub') userId: number) {
    return this.profileService.getMyProfile(userId);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @CurrentUser('sub') userId: number,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @CurrentUser('sub') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(userId, dto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('avatar')
  @HttpCode(HttpStatus.OK)
  uploadAvatar(
    @CurrentUser('sub') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(userId, file);
  }
}
