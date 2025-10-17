import { EventRsvp as PrismaEventRsvp, Event, User } from '@prisma/client';

export type EventRsvpModel = PrismaEventRsvp;

export interface EventRsvpWithRelations extends EventRsvpModel {
  event?: Event | null;
  user?: User | null;
}