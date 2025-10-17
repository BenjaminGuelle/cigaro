import { Tasting as PrismaTasting, User, Club, Event, Cigar } from '@prisma/client';

export type TastingModel = PrismaTasting;

export interface TastingWithRelations extends TastingModel {
  user?: User | null;
  club?: Club | null;
  event?: Event | null;
  cigar?: Cigar | null;
}