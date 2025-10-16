import { Club as PrismaClub } from '@prisma/client';

export type Club = PrismaClub;

export enum ClubPlanType {
  FREE = 'free',
  PREMIUM_SMALL = 'premium_small',
  PREMIUM_LARGE = 'premium_large'
}