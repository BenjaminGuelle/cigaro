import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PrivacySettingsModel,
  PublicUserProfile,
  User,
  UserProfile,
} from '@cigaro/libs';
import { ClubMember } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsersForAdmin(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getAllPublicUsers(viewerId?: string): Promise<PublicUserProfile[]> {
    const users: (User & { memberships: ClubMember[] })[] = await this.prisma.user.findMany({
      include: { memberships: { where: { status: 'ACTIVE' } } }
    });

    return Promise.all(
      users.map((user: User & { memberships: ClubMember[] }): Promise<PublicUserProfile> => this.getPublicUserProfile(user.id, viewerId))
    );
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user: (User & { memberships: ClubMember[] }) | null = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      isProfileComplete: !!user.pseudo,
      joinedClubsCount: user.memberships.length,
      needsProfileCompletion: !user.pseudo && !!user.firstName
    };
  }

  async getPublicUserProfile(
    targetUserId: string,
    viewerUserId?: string
  ): Promise<PublicUserProfile> {
    const user: (User & { memberships: ClubMember[] }) | null = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        memberships: { where: { status: 'ACTIVE' } }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const privacy = user.privacySettings as unknown as PrivacySettingsModel;

    let isClubMate = false;
    if (viewerUserId) {
      const sharedClubs = await this.prisma.clubMember.findFirst({
        where: {
          userId: viewerUserId,
          status: 'ACTIVE',
          clubId: {
            in: user.memberships.map(cm => cm.clubId)
          }
        }
      });
      isClubMate = !!sharedClubs;
    }

    return {
      id: user.id,
      pseudo: user.pseudo,
      firstName: (privacy.profile_public || isClubMate) ? user.firstName : null,
      lastName: (privacy.profile_public || isClubMate) ? user.lastName : null,
      avatarUrl: user.avatarUrl,
      rank: privacy.show_rank ? user.rank : 'INITIE',
      xp: privacy.show_rank ? user.xp : 0,
      joinedClubsCount: privacy.show_clubs ? user.memberships.length : 0,
      isClubMate
    };
  }

  async createTestUser(): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: 'test@cigaro.dev',
        firstName: 'Test',
        lastName: 'User',
        pseudo: 'testuser',
        isAdminPremium: true,
        adminPremiumNote: 'Test user pour développement',
      },
    });
  }


}
