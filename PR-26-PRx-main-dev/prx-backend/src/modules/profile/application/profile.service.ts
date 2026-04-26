import { randomUUID } from 'node:crypto';

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TagType } from '@generated-prisma/enums';
import type { Prisma } from '@generated-prisma/client';

import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { AUTH_MESSAGES } from '@modules/auth/application/constants/auth-messages.constants';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

import { ChangePasswordDto } from '@modules/profile/application/dto/requests/change-password.dto';
import { UpdateProfileDto } from '@modules/profile/application/dto/requests/update-profile.dto';
import { PROFILE_MESSAGES } from '@modules/profile/application/constants/profile-messages.constants';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

const AVATAR_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export type ProfileResponse = {
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
  socialNetworks: {
    socialNetworkId: number;
    socialNetworkName: string;
    username: string;
  }[];
  tags: { tagId: number; tagName: string }[];
};

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly tigrisStorage: TigrisStorageService,
  ) {}

  async getMyProfile(userId: number): Promise<{ data: ProfileResponse }> {
    await this.ensureProfile(userId);
    const data = await this.getProfilePayload(userId);
    return { data };
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<{ message: string; data: ProfileResponse }> {
    await this.ensureProfile(userId);

    await this.prisma.$transaction(async (tx) => {
      const regionId = await this.resolveRegionId(tx, dto.regionName);
      const townId = await this.resolveTownId(tx, dto.townName);

      await tx.profile.update({
        where: { id: userId },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          secondLastName: dto.secondLastName,
          biography: dto.biography,
          phoneNumber: dto.phoneNumber,
          phoneCodeId: dto.phoneCodeId,
          countryId: dto.countryId,
          regionId,
          townId,
          ...(dto.isEmailVisible !== undefined
            ? { isEmailVisible: dto.isEmailVisible }
            : {}),
          updatedBy: userId,
        },
      });

      if (dto.socialNetworks !== undefined) {
        await tx.profileSocialNetwork.deleteMany({
          where: { profileId: userId },
        });
        if (dto.socialNetworks.length > 0) {
          const requestedIds = [
            ...new Set(dto.socialNetworks.map((sn) => sn.socialNetworkId)),
          ];
          const existing = await tx.socialNetwork.findMany({
            where: { id: { in: requestedIds }, status: 1 },
            select: { id: true },
          });
          const allowed = new Set(existing.map((e) => e.id));
          const rows = dto.socialNetworks.filter((sn) =>
            allowed.has(sn.socialNetworkId),
          );
          if (rows.length > 0) {
            await tx.profileSocialNetwork.createMany({
              data: rows.map((sn) => ({
                profileId: userId,
                socialNetworkId: sn.socialNetworkId,
                username: sn.username,
                createdBy: userId,
              })),
            });
          }
        }
      }

      if (dto.tags !== undefined) {
        await this.syncTags(tx, userId, dto.tags, userId);
      }
    });

    const data = await this.getProfilePayload(userId);
    return { message: PROFILE_MESSAGES.UPDATED, data };
  }

  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    const valid = await this.bcryptService.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!valid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const passwordHash = await this.bcryptService.hash(dto.newPassword);
    await this.userRepository.update(userId, {
      passwordHash,
      updatedBy: userId,
    } as Partial<UserEntity>);

    return { message: PROFILE_MESSAGES.PASSWORD_CHANGED };
  }

  async uploadAvatar(
    userId: number,
    file: Express.Multer.File | undefined,
  ): Promise<{ message: string; data: { avatarUrl: string } }> {
    if (!file?.buffer?.length) {
      throw new BadRequestException(PROFILE_MESSAGES.AVATAR_INVALID);
    }

    const ext = AVATAR_MIME_TO_EXT[file.mimetype];
    if (!ext || file.size > MAX_AVATAR_BYTES) {
      throw new BadRequestException(PROFILE_MESSAGES.AVATAR_INVALID);
    }

    const objectPath = `avatars/${userId}/${randomUUID()}.${ext}`;
    await this.tigrisStorage.uploadObject({
      path: objectPath,
      body: file.buffer,
      isPublic: true,
      contentType: file.mimetype,
    });

    const avatarUrl = await this.tigrisStorage.getReadUrl(objectPath, true);

    await this.userRepository.update(userId, {
      avatarUrl,
      updatedBy: userId,
    } as Partial<UserEntity>);

    return {
      message: PROFILE_MESSAGES.AVATAR_UPDATED,
      data: { avatarUrl },
    };
  }

  private async ensureProfile(userId: number): Promise<void> {
    const exists = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (exists) return;

    await this.prisma.profile.create({
      data: {
        id: userId,
        createdBy: userId,
        isEmailVisible: false,
      },
    });
  }

  private async getProfilePayload(userId: number): Promise<ProfileResponse> {
    const row = await this.prisma.profile.findUniqueOrThrow({
      where: { id: userId },
      include: {
        phoneCode: true,
        country: true,
        region: true,
        town: true,
        profileSocialNetworks: {
          where: { status: 1 },
          include: { socialNetwork: true },
        },
        tagProfiles: {
          where: { status: 1 },
          include: { tag: true },
        },
      },
    });

    return {
      userId: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      secondLastName: row.secondLastName,
      biography: row.biography,
      phoneNumber: row.phoneNumber,
      phoneCodeId: row.phoneCodeId,
      phoneCode: row.phoneCode?.code ?? null,
      isEmailVisible: row.isEmailVisible,
      countryId: row.countryId,
      countryName: row.country?.name ?? null,
      regionId: row.regionId,
      regionName: row.region?.name ?? null,
      townId: row.townId,
      townName: row.town?.name ?? null,
      socialNetworks: row.profileSocialNetworks.map((psn) => ({
        socialNetworkId: psn.socialNetworkId,
        socialNetworkName: psn.socialNetwork.name,
        username: psn.username,
      })),
      tags: row.tagProfiles.map((tp) => ({
        tagId: tp.tag.id,
        tagName: tp.tag.name,
      })),
    };
  }

  private async resolveRegionId(
    tx: Prisma.TransactionClient,
    name: string | null | undefined,
  ): Promise<number | null> {
    if (!name?.trim()) return null;
    const trimmed = name.trim().slice(0, 50);
    let region = await tx.region.findFirst({
      where: { name: trimmed, status: 1 },
    });
    if (!region) {
      region = await tx.region.create({ data: { name: trimmed } });
    }
    return region.id;
  }

  private async resolveTownId(
    tx: Prisma.TransactionClient,
    name: string | null | undefined,
  ): Promise<number | null> {
    if (!name?.trim()) return null;
    const trimmed = name.trim().slice(0, 50);
    let town = await tx.town.findFirst({
      where: { name: trimmed, status: 1 },
    });
    if (!town) {
      town = await tx.town.create({ data: { name: trimmed } });
    }
    return town.id;
  }

  private async syncTags(
    tx: Prisma.TransactionClient,
    profileId: number,
    tagNames: string[],
    actingUserId: number,
  ): Promise<void> {
    await tx.tagProfile.deleteMany({ where: { profileId } });

    const normalized = [
      ...new Set(
        tagNames
          .map((t) => t.trim().slice(0, 25))
          .filter((t) => t.length > 0),
      ),
    ];

    for (const name of normalized) {
      let tag = await tx.tag.findFirst({
        where: { name, type: TagType.profile, status: 1 },
      });
      if (!tag) {
        tag = await tx.tag.create({
          data: { name, type: TagType.profile },
        });
      }
      await tx.tagProfile.create({
        data: {
          profileId,
          tagId: tag.id,
          createdBy: actingUserId,
        },
      });
    }
  }
}
