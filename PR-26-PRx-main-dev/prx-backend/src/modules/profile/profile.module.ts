import { Module } from '@nestjs/common';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

import { ProfileService } from '@modules/profile/application/profile.service';
import { ProfileController } from '@modules/profile/presentation/controllers/profile.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
