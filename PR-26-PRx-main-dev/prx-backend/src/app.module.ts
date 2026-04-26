import envConfig from '@config/env.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { MailModule } from '@shared/infrastructure/mail/mail.module';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { StorageModule } from '@shared/infrastructure/storage/storage.module';

import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ProfileModule } from '@modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>('throttle.ttl'),
            limit: config.getOrThrow<number>('throttle.limit'),
          },
        ],
      }),
    }),

    PrismaModule,
    MailModule,
    StorageModule,

    UsersModule,
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule {}
