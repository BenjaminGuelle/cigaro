import { Event as PrismaEvent, Club, User, Address, EventRsvp, Tasting } from '@prisma/client';

export type EventModel = PrismaEvent;

export interface EventWithRelations extends EventModel {
  club?: Club | null;
  creator?: User | null;
  locationHost?: User | null;
  locationAddress?: Address | null;
  rsvps?: EventRsvp[];
  tastings?: Tasting[];
}