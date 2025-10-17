// =============================================================================
// CORE ENUMS - Single Source of Truth
// =============================================================================

/**
 * USER RELATED
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  DELETED: 'deleted'
} as const;

export const USER_ROLE = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export const USER_RANK = {
  INITIE: 'initie',
  AFICIONADO: 'aficionado',
  CONNAISSEUR: 'connaisseur'
} as const;

/**
 * PLAN TYPEs
 */
export const PLAN_TYPE = {
  FREE: 'free',
  PREMIUM: 'premium'
} as const;

export const CLUB_PLAN_TYPE = {
  FREE: 'free',
  PREMIUM_SMALL: 'premium_small',
  PREMIUM_LARGE: 'premium_large'
} as const;

/**
 * CLUB RELATED
 */
export const CLUB_ROLE = {
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  MEMBER: 'member'
} as const;

export const CLUB_FUNCTIONAL_ROLE = {
  TREASURER: 'treasurer',
  ORGANIZER: 'organizer'
} as const;

export const CLUB_MEMBER_STATUS = {
  INVITED: 'invited',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  LEFT: 'left'
} as const;

/**
 * EVENT RELATED
 */
export const LOCATION_TYPE = {
  MEMBER_HOME: 'member_home',
  CUSTOM: 'custom'
} as const;

export const ADDRESS_VISIBILITY = {
  ALL: 'all',
  CONFIRMED_ONLY: 'confirmed_only'
} as const;

export const EVENT_VISIBILITY = {
  MEMBERS_ONLY: 'members_only',
  INVITED_ONLY: 'invited_only',
  PUBLIC: 'public'
} as const;

export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const RSVP_STATUS = {
  YES: 'yes',
  NO: 'no',
  MAYBE: 'maybe'
} as const;

/**
 * CONTENT RELATED
 */
export const TASTING_VISIBILITY = {
  PRIVATE: 'private',
  CLUB: 'club',
  PUBLIC: 'public'
} as const;

export const AUTHOR_TYPE = {
  USER: 'user',
  CLUB: 'club'
} as const;

export const POST_VISIBILITY = {
  PRIVATE: 'private',
  CLUB: 'club',
  PUBLIC: 'public'
} as const;

export const COMMENTABLE_TYPE = {
  EVENT: 'event',
  POST: 'post',
  TASTING: 'tasting'
} as const;

export const AWARD_TYPE = {
  CIGAR_OF_MONTH: 'cigar_of_month',
  CIGAR_OF_QUARTER: 'cigar_of_quarter',
  CIGAR_OF_YEAR: 'cigar_of_year',
  TRENDING_CIGAR: 'trending_cigar',
  DISCOVERY_CIGAR: 'discovery_cigar'
} as const;

export const LIKEABLE_TYPE = {
  POST: 'post',
  COMMENT: 'comment',
  TASTING: 'tasting'
} as const;


// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
export type UserRank = typeof USER_RANK[keyof typeof USER_RANK];
export type PlanType = typeof PLAN_TYPE[keyof typeof PLAN_TYPE];
export type ClubPlanType = typeof CLUB_PLAN_TYPE[keyof typeof CLUB_PLAN_TYPE];
export type ClubRole = typeof CLUB_ROLE[keyof typeof CLUB_ROLE];
export type ClubFunctionalRole = typeof CLUB_FUNCTIONAL_ROLE[keyof typeof CLUB_FUNCTIONAL_ROLE];
export type ClubMemberStatus = typeof CLUB_MEMBER_STATUS[keyof typeof CLUB_MEMBER_STATUS];
export type LocationType = typeof LOCATION_TYPE[keyof typeof LOCATION_TYPE];
export type AddressVisibility = typeof ADDRESS_VISIBILITY[keyof typeof ADDRESS_VISIBILITY];
export type EventVisibility = typeof EVENT_VISIBILITY[keyof typeof EVENT_VISIBILITY];
export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];
export type RsvpStatus = typeof RSVP_STATUS[keyof typeof RSVP_STATUS];
export type TastingVisibility = typeof TASTING_VISIBILITY[keyof typeof TASTING_VISIBILITY];
export type AuthorType = typeof AUTHOR_TYPE[keyof typeof AUTHOR_TYPE];
export type PostVisibility = typeof POST_VISIBILITY[keyof typeof POST_VISIBILITY];
export type CommentableType = typeof COMMENTABLE_TYPE[keyof typeof COMMENTABLE_TYPE];
export type AwardType = typeof AWARD_TYPE[keyof typeof AWARD_TYPE];
export type LikeableType = typeof LIKEABLE_TYPE[keyof typeof LIKEABLE_TYPE];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const isValidUserStatus = (status: string): status is UserStatus =>
  Object.values(USER_STATUS).includes(status as UserStatus);

export const isValidClubRole = (role: string): role is ClubRole =>
  Object.values(CLUB_ROLE).includes(role as ClubRole);

export const isValidEventStatus = (status: string): status is EventStatus =>
  Object.values(EVENT_STATUS).includes(status as EventStatus);

/**
 * Helper pour get all enum values
 */
export const getAllUserStatuses = () => Object.values(USER_STATUS);
export const getAllClubRoles = () => Object.values(CLUB_ROLE);
export const getAllEventStatuses = () => Object.values(EVENT_STATUS);
export const getAllLikeableTypes = () => Object.values(LIKEABLE_TYPE);