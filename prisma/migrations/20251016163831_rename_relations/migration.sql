-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'banned', 'deleted');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'moderator', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "ClubPlanType" AS ENUM ('free', 'premium_small', 'premium_large');

-- CreateEnum
CREATE TYPE "UserRank" AS ENUM ('initie', 'aficionado', 'connaisseur');

-- CreateEnum
CREATE TYPE "ClubRole" AS ENUM ('president', 'vice_president', 'member');

-- CreateEnum
CREATE TYPE "ClubFunctionalRole" AS ENUM ('treasurer', 'organizer');

-- CreateEnum
CREATE TYPE "ClubMemberStatus" AS ENUM ('invited', 'active', 'suspended', 'left');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('member_home', 'custom');

-- CreateEnum
CREATE TYPE "AddressVisibility" AS ENUM ('all', 'confirmed_only');

-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('members_only', 'invited_only', 'public');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('yes', 'no', 'maybe');

-- CreateEnum
CREATE TYPE "TastingVisibility" AS ENUM ('private', 'club', 'public');

-- CreateEnum
CREATE TYPE "AuthorType" AS ENUM ('user', 'club');

-- CreateEnum
CREATE TYPE "PostVisibility" AS ENUM ('private', 'club', 'public');

-- CreateEnum
CREATE TYPE "CommentableType" AS ENUM ('event', 'post', 'tasting');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "pseudo" VARCHAR(50),
    "avatar_url" TEXT,
    "address" JSONB,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "user_role" "UserRole" NOT NULL DEFAULT 'user',
    "solo_plan" "PlanType" NOT NULL DEFAULT 'free',
    "solo_subscription_id" VARCHAR(255),
    "is_admin_premium" BOOLEAN NOT NULL DEFAULT false,
    "admin_premium_note" TEXT,
    "rank" "UserRank" NOT NULL DEFAULT 'initie',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "privacy_settings" JSONB NOT NULL DEFAULT '{"profile_public": true, "email_visible": false, "show_rank": true, "show_tastings_count": true, "show_clubs": true, "show_location": false}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "cover_photo_url" TEXT,
    "contact_email" VARCHAR(255),
    "owner_id" UUID NOT NULL,
    "address" JSONB,
    "club_plan" "ClubPlanType" NOT NULL DEFAULT 'free',
    "club_subscription_id" VARCHAR(255),
    "is_admin_premium" BOOLEAN NOT NULL DEFAULT false,
    "admin_premium_note" TEXT,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "invitation_code" VARCHAR(20),
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "founded_at" DATE,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "club_id" UUID NOT NULL,
    "role" "ClubRole" NOT NULL,
    "functional_role" "ClubFunctionalRole",
    "status" "ClubMemberStatus" NOT NULL DEFAULT 'invited',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "club_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "photo_url" TEXT,
    "location_type" "LocationType" NOT NULL DEFAULT 'custom',
    "location_host_id" UUID,
    "location_name" VARCHAR(200) NOT NULL,
    "location_address" JSONB NOT NULL,
    "address_visible_to" "AddressVisibility" NOT NULL DEFAULT 'confirmed_only',
    "location_notes" TEXT,
    "event_date" TIMESTAMPTZ(6) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 180,
    "max_participants" INTEGER,
    "visibility" "EventVisibility" NOT NULL DEFAULT 'members_only',
    "status" "EventStatus" NOT NULL DEFAULT 'upcoming',
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rsvps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "event_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "RsvpStatus" NOT NULL DEFAULT 'maybe',
    "notes" TEXT,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tastings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "club_id" UUID,
    "event_id" UUID,
    "cigar_name" VARCHAR(200) NOT NULL,
    "cigar_brand" VARCHAR(100),
    "vitola" VARCHAR(100),
    "rating" DOUBLE PRECISION NOT NULL,
    "is_expert_mode" BOOLEAN NOT NULL DEFAULT false,
    "aromas" TEXT[],
    "tasting_notes" TEXT,
    "smoked_at" TIMESTAMPTZ(6),
    "duration_minutes" INTEGER,
    "moment" VARCHAR(50),
    "situation" VARCHAR(50),
    "pairing" VARCHAR(200),
    "cape_aspect" VARCHAR(50),
    "cape_color" VARCHAR(50),
    "touch" VARCHAR(50),
    "raw_smoke_tastes" TEXT[],
    "raw_smoke_aromas" TEXT[],
    "tastes_hay" TEXT[],
    "tastes_divine" TEXT[],
    "tastes_manure" TEXT[],
    "aromas_hay" TEXT[],
    "aromas_divine" TEXT[],
    "aromas_manure" TEXT[],
    "body_strength" VARCHAR(50),
    "aroma_variety" VARCHAR(50),
    "draw" VARCHAR(50),
    "terroir" VARCHAR(50),
    "balance" VARCHAR(50),
    "ash_nature" VARCHAR(50),
    "final_impression" VARCHAR(50),
    "aromatic_persistence" VARCHAR(50),
    "photos" TEXT[],
    "visibility" "TastingVisibility" NOT NULL DEFAULT 'private',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tastings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "author_type" "AuthorType" NOT NULL,
    "author_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "content" TEXT NOT NULL,
    "photos" TEXT[],
    "tasting_ids" TEXT[],
    "visibility" "PostVisibility" NOT NULL DEFAULT 'club',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "commentable_type" "CommentableType" NOT NULL,
    "commentable_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_by" UUID,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_pseudo_key" ON "users"("pseudo");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_pseudo_idx" ON "users"("pseudo");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "idx_users_user_role" ON "users"("user_role");

-- CreateIndex
CREATE INDEX "idx_users_solo_plan" ON "users"("solo_plan");

-- CreateIndex
CREATE INDEX "idx_users_admin_premium" ON "users"("is_admin_premium");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_invitation_code_key" ON "clubs"("invitation_code");

-- CreateIndex
CREATE INDEX "idx_clubs_owner" ON "clubs"("owner_id");

-- CreateIndex
CREATE INDEX "idx_clubs_invitation_code" ON "clubs"("invitation_code");

-- CreateIndex
CREATE INDEX "idx_clubs_is_public" ON "clubs"("is_public");

-- CreateIndex
CREATE INDEX "idx_clubs_club_plan" ON "clubs"("club_plan");

-- CreateIndex
CREATE INDEX "idx_clubs_member_count" ON "clubs"("member_count");

-- CreateIndex
CREATE INDEX "idx_clubs_admin_premium" ON "clubs"("is_admin_premium");

-- CreateIndex
CREATE INDEX "idx_club_members_user" ON "club_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_club_members_club" ON "club_members"("club_id");

-- CreateIndex
CREATE INDEX "idx_club_members_role" ON "club_members"("role");

-- CreateIndex
CREATE INDEX "idx_club_members_status" ON "club_members"("status");

-- CreateIndex
CREATE UNIQUE INDEX "club_members_user_id_club_id_key" ON "club_members"("user_id", "club_id");

-- CreateIndex
CREATE INDEX "idx_events_club" ON "events"("club_id");

-- CreateIndex
CREATE INDEX "idx_events_date" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "idx_events_status" ON "events"("status");

-- CreateIndex
CREATE INDEX "idx_events_visibility" ON "events"("visibility");

-- CreateIndex
CREATE INDEX "idx_events_created_by" ON "events"("created_by");

-- CreateIndex
CREATE INDEX "idx_events_location_host" ON "events"("location_host_id");

-- CreateIndex
CREATE INDEX "idx_event_rsvps_event" ON "event_rsvps"("event_id");

-- CreateIndex
CREATE INDEX "idx_event_rsvps_user" ON "event_rsvps"("user_id");

-- CreateIndex
CREATE INDEX "idx_event_rsvps_status" ON "event_rsvps"("status");

-- CreateIndex
CREATE UNIQUE INDEX "event_rsvps_event_id_user_id_key" ON "event_rsvps"("event_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_tastings_user" ON "tastings"("user_id");

-- CreateIndex
CREATE INDEX "idx_tastings_club" ON "tastings"("club_id");

-- CreateIndex
CREATE INDEX "idx_tastings_event" ON "tastings"("event_id");

-- CreateIndex
CREATE INDEX "idx_tastings_cigar_name" ON "tastings"("cigar_name");

-- CreateIndex
CREATE INDEX "idx_tastings_rating" ON "tastings"("rating");

-- CreateIndex
CREATE INDEX "idx_tastings_mode" ON "tastings"("is_expert_mode");

-- CreateIndex
CREATE INDEX "idx_tastings_visibility" ON "tastings"("visibility");

-- CreateIndex
CREATE INDEX "idx_tastings_created" ON "tastings"("created_at");

-- CreateIndex
CREATE INDEX "idx_posts_author" ON "posts"("author_type", "author_id");

-- CreateIndex
CREATE INDEX "idx_posts_visibility" ON "posts"("visibility");

-- CreateIndex
CREATE INDEX "idx_posts_is_deleted" ON "posts"("is_deleted");

-- CreateIndex
CREATE INDEX "idx_posts_created" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "idx_comments_user" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "idx_comments_commentable" ON "comments"("commentable_type", "commentable_id");

-- CreateIndex
CREATE INDEX "idx_comments_is_deleted" ON "comments"("is_deleted");

-- CreateIndex
CREATE INDEX "idx_comments_created" ON "comments"("created_at");

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_location_host_id_fkey" FOREIGN KEY ("location_host_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
