import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserModel } from '@cigaro/libs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // ==========================================
  // SUPABASE AUTH METHODS
  // ==========================================

  /**
   * Gestion callback Supabase (OAuth + Email/Password)
   */
  async handleSupabaseUser(supabaseUser: any): Promise<UserModel> {
    let user = await this.prisma.user.findUnique({
      where: { id: supabaseUser.id }, // ID Supabase = ID utilisateur
      include: {
        privacySettings: true,
        memberships: {
          where: { status: 'ACTIVE' },
          select: { id: true }
        }
      }
    });

    if (user) {
      if (!user.avatarUrl && supabaseUser.user_metadata?.avatar_url) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: supabaseUser.user_metadata.avatar_url
          },
          include: {
            privacySettings: true,
            memberships: {
              where: { status: 'ACTIVE' },
              select: { id: true }
            }
          }
        });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          firstName: supabaseUser.user_metadata?.first_name,
          lastName: supabaseUser.user_metadata?.last_name,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          rank: 'INITIE',
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
          privacySettings: true,
          memberships: {
            where: { status: 'ACTIVE' },
            select: { id: true }
          }
        }
      });
    }

    return {
      ...user,
      joinedClubsCount: user.memberships.length,
      isProfileComplete: !!(user.pseudo && user.firstName),
      needsProfileCompletion: !user.pseudo && !!user.firstName
    } as UserModel;
  }
}