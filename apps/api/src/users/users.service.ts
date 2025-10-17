import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorManager } from '../common/errors/error-manager';
import { UserModel } from '@cigaro/libs';
import { GetUsersQueryDto } from '../common/dto/users/get-users-query.dto';
import { CreateUserDto } from '../common/dto/users/create-user.dto';
import { UpdateUserDto } from '../common/dto/users/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // PUBLIC METHODS
  // ==========================================

  /**
   * Récupérer tous les utilisateurs publics avec pagination
   */
  async findAllPublic(query: GetUsersQueryDto) {
    const { page = 1, limit = 20, search, rank, onlyActive = true } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (onlyActive) {
      where.status = 'ACTIVE';
    }

    if (rank) {
      where.rank = rank.toUpperCase();
    }

    if (search) {
      where.OR = [
        { pseudo: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          privacySettings: true,
          memberships: {
            where: { status: 'ACTIVE' },
            select: { id: true }
          }
        }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users: users.map(user => ({
        ...user,
        joinedClubsCount: user.memberships.length
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupérer un utilisateur par ID avec privacy settings
   */
  async findById(id: string, viewerId?: string): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        status: 'ACTIVE'
      },
      include: {
        privacySettings: true,
        address: true,
        memberships: {
          where: { status: 'ACTIVE' },
          include: {
            club: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    if (!user) {
      throw ErrorManager.userNotFound(id);
    }

    let enrichedUser = {
      ...user,
      joinedClubsCount: user.memberships.length,
      isProfileComplete: !!(user.pseudo && user.firstName),
      needsProfileCompletion: !user.pseudo && !!user.firstName
    } as UserModel;

    if (viewerId && viewerId !== id) {
      const relationshipData = await this.getViewerRelationship(viewerId, id);
      enrichedUser = {
        ...enrichedUser,
        ...relationshipData
      };
    }

    return enrichedUser;
  }

  /**
   * Obtenir les données de relation entre viewer et target
   */
  private async getViewerRelationship(viewerId: string, targetId: string) {
    const sharedClubs = await this.getSharedClubs(viewerId, targetId);

    const areClubMates = sharedClubs.length > 0;

    this.logProfileView(viewerId, targetId, areClubMates);

    return {
      sharedClubs,
      areClubMates,
      sharedClubsCount: sharedClubs.length,
      viewerContext: {
        canViewExtendedProfile: areClubMates,
        relationshipType: areClubMates ? 'club_mate' : 'public'
      }
    };
  }

  /**
   * Récupérer les clubs partagés entre deux utilisateurs
   */
  private async getSharedClubs(viewerId: string, targetId: string) {
    const sharedMemberships = await this.prisma.clubMember.findMany({
      where: {
        AND: [
          { status: 'ACTIVE' },
          {
            club: {
              members: {
                some: {
                  AND: [
                    { userId: viewerId },
                    { status: 'ACTIVE' }
                  ]
                }
              }
            }
          },
          { userId: targetId }
        ]
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            isPublic: true
          }
        }
      }
    });

    return sharedMemberships.map(membership => membership.club);
  }

  /**
   * Logger les consultations de profil (analytics)
   */
  private async logProfileView(viewerId: string, targetId: string, areClubMates: boolean) {
    try {
      const analyticsEvent = {
        event: 'profile_view',
        viewerId,
        targetId,
        areClubMates,
        timestamp: new Date().toISOString(),
        metadata: {
          relationshipType: areClubMates ? 'club_mate' : 'public',
          userAgent: 'api_call'
        }
      };

      console.log('📊 Profile Analytics:', analyticsEvent);

      this.persistProfileView(viewerId, targetId, areClubMates).catch(error => {
        console.warn('⚠️ Failed to persist profile view:', error.message);
      });

    } catch (error) {
      console.warn('⚠️ Profile view logging failed:', error.message);
    }
  }

  /**
   * Persister la vue de profil en base (async, non-blocking)
   */
  private async persistProfileView(viewerId: string, targetId: string, areClubMates: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: targetId },
      data: {
        // Increment profile views (si le champ existe)
        // profileViewsCount: { increment: 1 }

        // Pour l'instant, on update juste le updatedAt pour tracking
        updatedAt: new Date()
      }
    });

    // TODO Future: Table profile_views dédiée pour analytics avancées
    // await this.prisma.profileView.create({
    //   data: { viewerId, targetId, areClubMates, viewedAt: new Date() }
    // });
  }

  /**
   * Récupérer le profil complet de l'utilisateur (route /me)
   */
  async getMyProfile(userId: string): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        privacySettings: true,
        address: true,
        memberships: {
          where: { status: 'ACTIVE' },
          include: {
            club: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                clubPlan: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw ErrorManager.userNotFound(userId);
    }

    if (user.status !== 'ACTIVE') {
      throw ErrorManager.userNotActive(userId);
    }

    // Stats calculées pour le profil personnel
    const [totalTastings, averageRating] = await Promise.all([
      this.prisma.tasting.count({
        where: { userId }
      }),
      this.prisma.tasting.aggregate({
        where: { userId },
        _avg: { rating: true }
      })
    ]);

    return {
      ...user,
      joinedClubsCount: user.memberships.length,
      isProfileComplete: !!(user.pseudo && user.firstName),
      needsProfileCompletion: !user.pseudo && !!user.firstName,
      totalTastings,
      averageRating: averageRating._avg.rating || 0
    } as UserModel;
  }

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================

  /**
   * Créer un nouvel utilisateur
   */
  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw ErrorManager.invalidArgument(
        'email',
        'Email already exists',
        'UsersService.create'
      );
    }

    if (createUserDto.pseudo) {
      const existingPseudo = await this.prisma.user.findUnique({
        where: { pseudo: createUserDto.pseudo }
      });

      if (existingPseudo) {
        throw ErrorManager.invalidArgument(
          'pseudo',
          'Pseudo already exists',
          'UsersService.create'
        );
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        pseudo: createUserDto.pseudo,
        avatarUrl: createUserDto.avatarUrl,
        rank: (createUserDto.rank?.toUpperCase() || 'INITIE') as any,
        privacySettings: {
          create: {
            profilePublic: true,
            emailVisible: false,
            showRank: true,
            showTastingsCount: true,
            showClubs: true,
            showLocation: false
          }
        }
      },
      include: {
        privacySettings: true
      }
    });

    return user as UserModel;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userId: string, updateDto: UpdateUserDto): Promise<UserModel> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      throw ErrorManager.userNotFound(userId);
    }

    if (updateDto.pseudo && updateDto.pseudo !== existingUser.pseudo) {
      const existingPseudo = await this.prisma.user.findUnique({
        where: { pseudo: updateDto.pseudo }
      });

      if (existingPseudo) {
        throw ErrorManager.invalidArgument(
          'pseudo',
          'Pseudo already exists',
          'UsersService.updateProfile'
        );
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateDto,
      include: {
        privacySettings: true,
        memberships: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        }
      }
    });

    return {
      ...updatedUser,
      joinedClubsCount: updatedUser.memberships.length,
      isProfileComplete: !!(updatedUser.pseudo && updatedUser.firstName),
      needsProfileCompletion: !updatedUser.pseudo && !!updatedUser.firstName
    } as UserModel;
  }

  // ==========================================
  // ADMIN METHODS
  // ==========================================

  /**
   * Récupérer tous les utilisateurs avec pagination (admin seulement)
   */
  async findAllForAdmin(query: GetUsersQueryDto) {
    const { page = 1, limit = 50, search, rank, onlyActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (onlyActive) {
      where.status = 'ACTIVE';
    }

    if (rank) {
      where.rank = rank.toUpperCase();
    }

    if (search) {
      where.OR = [
        { pseudo: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          privacySettings: true,
          address: true,
          memberships: {
            include: {
              club: {
                select: { id: true, name: true, clubPlan: true }
              }
            }
          }
        }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      users: users.map(user => ({
        ...user,
        joinedClubsCount: user.memberships.length,
        isProfileComplete: !!(user.pseudo && user.firstName),
        needsProfileCompletion: !user.pseudo && !!user.firstName
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupérer tous les utilisateurs (admin seulement) - Version sans pagination
   */
  async findAllForAdminComplete() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        privacySettings: true,
        memberships: {
          include: {
            club: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });
  }
}