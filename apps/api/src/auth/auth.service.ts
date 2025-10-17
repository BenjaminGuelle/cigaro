import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import {
  CompleteProfileRequest,
  SupabaseUserModel,
  User,
  UserProfile,
} from '@cigaro/libs';
import { ClubMember } from '@prisma/client';

@Injectable()
export class AuthService {
  private supabase;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  async completeUserProfile(userId: string, data: CompleteProfileRequest): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        pseudo: data.pseudo,
        firstName: data.firstName,
        lastName: data.lastName,
      }
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user: User & { memberships: ClubMember[] } | null = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { memberships: { where: { status: 'ACTIVE' } } }
    });

    return {
      ...user,
      isProfileComplete: !!user.pseudo,
      joinedClubsCount: user.memberships.length,
      needsProfileCompletion: !user.pseudo && !!user.firstName
    };
  }

  async handleAuthCallback(supabaseUser: SupabaseUserModel): Promise<User> {
    let user: User | null = await this.prisma.user.findUnique({
      where: { id: supabaseUser.id }
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          firstName: supabaseUser.user_metadata?.first_name,
          lastName: supabaseUser.user_metadata?.last_name,
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
        }
      });
    }

    return user;
  }
}