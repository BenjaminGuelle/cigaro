import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserRequest,
  PrivacySettingsModel,
  PublicUserProfile,
  UpdateUserRequest,
  User,
  UserProfile,
} from '@cigaro/libs';
import { ClubMember } from '@prisma/client';
import { ErrorManager } from '../common/errors/error-manager';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ✅ MÉTHODES BASIQUES (sans includes dynamiques pour l'instant)

  async getAllUsersForAdmin(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPublicUsers(): Promise<PublicUserProfile[]> {
    const users = await this.prisma.user.findMany({
      where: { status: 'ACTIVE' },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          select: { clubId: true } // Juste pour compter
        }
      },
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => this.transformToPublicProfile(user));
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!user) {
      ErrorManager.userNotFound(userId);
    }

    if (user.status !== 'ACTIVE') {
      ErrorManager.userNotActive();
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
    const user = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
        status: 'ACTIVE'
      },
      include: {
        privacySettings: true, // ✅ Relation native
        memberships: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!user) {
      ErrorManager.userNotFound(targetUserId);
    }

    return this.transformToPublicProfile(user, viewerUserId);
  }

  // ✅ CRUD OPERATIONS

  async updateMyProfile(userId: string, updateData: UpdateUserRequest): Promise<User> {
    // Business validation
    if (updateData.pseudo) {
      const existingUser = await this.prisma.user.findUnique({
        where: { pseudo: updateData.pseudo }
      });

      if (existingUser && existingUser.id !== userId) {
        ErrorManager.invalidArgument('pseudo', 'Ce pseudo est déjà utilisé');
      }
    }

    // ✅ Plus de casting - types natifs
    const updatePayload: any = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      pseudo: updateData.pseudo,
    };

    // Gestion address (création ou update)
    if (updateData.address !== undefined) {
      if (updateData.address === null) {
        // Supprimer l'adresse
        updatePayload.addressId = null;
      } else {
        // Créer ou réutiliser adresse
        const address = await this.prisma.address.create({
          data: updateData.address
        });
        updatePayload.addressId = address.id;
      }
    }

    // Gestion privacy settings
    if (updateData.privacySettings !== undefined) {
      if (updateData.privacySettings === null) {
        updatePayload.privacySettingsId = null;
      } else {
        const privacySettings = await this.prisma.userPrivacySettings.create({
          data: updateData.privacySettings
        });
        updatePayload.privacySettingsId = privacySettings.id;
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });
  }

  async createUser(createData: CreateUserRequest): Promise<User> {
    // Business validation
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createData.email }
    });

    if (existingUser) {
      ErrorManager.invalidArgument('email', 'Cette adresse email est déjà utilisée');
    }

    const createPayload: any = {
      email: createData.email,
      firstName: createData.firstName,
      lastName: createData.lastName,
      pseudo: createData.pseudo,
      avatarUrl: createData.avatarUrl,
      status: 'ACTIVE',
      isAdminPremium: createData.isAdminPremium || false,
      adminPremiumNote: createData.adminPremiumNote,
    };

    // Gestion address
    if (createData.address) {
      const address = await this.prisma.address.create({
        data: createData.address
      });
      createPayload.addressId = address.id;
    }

    // Gestion privacy settings (defaults)
    if (createData.privacySettings) {
      const privacySettings = await this.prisma.userPrivacySettings.create({
        data: createData.privacySettings
      });
      createPayload.privacySettingsId = privacySettings.id;
    }

    return this.prisma.user.create({
      data: createPayload,
    });
  }

  async createTestUser(): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: `test_${Date.now()}@cigaro.dev`,
        firstName: 'Test',
        lastName: 'User',
        pseudo: `testuser_${Date.now()}`,
        status: 'ACTIVE',
        isAdminPremium: true,
        adminPremiumNote: 'Test user pour développement',
      },
    });
  }

  // ✅ HELPER METHODS

  private transformToPublicProfile(
    user: any,
    viewerUserId?: string
  ): PublicUserProfile {
    // Privacy settings avec fallback
    const privacy = user.privacySettings || {
      profilePublic: false,
      emailVisible: false,
      showRank: true,
      showTastingsCount: true,
      showClubs: true,
      showLocation: false,
    };

    // Check if viewer is clubmate (si on a les memberships)
    let isClubMate = false;
    if (viewerUserId && viewerUserId !== user.id && user.memberships) {
      // TODO: Query pour vérifier clubs partagés
      // Pour l'instant false, on optimisera plus tard
      isClubMate = false;
    }

    const showPrivateInfo = privacy.profilePublic || isClubMate || viewerUserId === user.id;

    return {
      id: user.id,
      pseudo: user.pseudo,
      firstName: showPrivateInfo ? user.firstName : null,
      lastName: showPrivateInfo ? user.lastName : null,
      avatarUrl: user.avatarUrl,
      rank: privacy.showRank ? user.rank : 'INITIE',
      xp: privacy.showRank ? user.xp : 0,
      joinedClubsCount: privacy.showClubs ? (user.memberships?.length || 0) : 0,
      status: user.status,
      isClubMate: isClubMate,
    };
  }
}
