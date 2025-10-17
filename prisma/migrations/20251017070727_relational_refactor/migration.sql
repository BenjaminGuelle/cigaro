/*
  Warnings:

  - You are about to drop the column `address` on the `clubs` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `clubs` table. All the data in the column will be lost.
  - You are about to drop the column `location_address` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `privacy_settings` on the `users` table. All the data in the column will be lost.
  - Added the required column `location_address_id` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."idx_clubs_admin_premium";

-- DropIndex
DROP INDEX "public"."idx_clubs_member_count";

-- DropIndex
DROP INDEX "public"."idx_users_admin_premium";

-- DropIndex
DROP INDEX "public"."idx_users_solo_plan";

-- DropIndex
DROP INDEX "public"."idx_users_user_role";

-- AlterTable
ALTER TABLE "clubs" DROP COLUMN "address",
DROP COLUMN "settings",
ADD COLUMN     "address_id" UUID,
ADD COLUMN     "settings_id" UUID;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "location_address",
ADD COLUMN     "location_address_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "address",
DROP COLUMN "privacy_settings",
ADD COLUMN     "address_id" UUID,
ADD COLUMN     "privacy_settings_id" UUID;

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "address" VARCHAR(200) NOT NULL,
    "additional_address" VARCHAR(100),
    "city" VARCHAR(100) NOT NULL,
    "zip" VARCHAR(20) NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "label" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_privacy_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profile_public" BOOLEAN NOT NULL DEFAULT true,
    "email_visible" BOOLEAN NOT NULL DEFAULT false,
    "show_rank" BOOLEAN NOT NULL DEFAULT true,
    "show_tastings_count" BOOLEAN NOT NULL DEFAULT true,
    "show_clubs" BOOLEAN NOT NULL DEFAULT true,
    "show_location" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_privacy_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "allow_guest_invites" BOOLEAN NOT NULL DEFAULT false,
    "require_event_approval" BOOLEAN NOT NULL DEFAULT false,
    "auto_generate_reports" BOOLEAN NOT NULL DEFAULT true,
    "public_tastings" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "addresses_city_idx" ON "addresses"("city");

-- CreateIndex
CREATE INDEX "addresses_country_idx" ON "addresses"("country");

-- CreateIndex
CREATE INDEX "clubs_address_id_idx" ON "clubs"("address_id");

-- CreateIndex
CREATE INDEX "clubs_settings_id_idx" ON "clubs"("settings_id");

-- CreateIndex
CREATE INDEX "events_location_address_id_idx" ON "events"("location_address_id");

-- CreateIndex
CREATE INDEX "users_address_id_idx" ON "users"("address_id");

-- CreateIndex
CREATE INDEX "users_privacy_settings_id_idx" ON "users"("privacy_settings_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_privacy_settings_id_fkey" FOREIGN KEY ("privacy_settings_id") REFERENCES "user_privacy_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "club_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_location_address_id_fkey" FOREIGN KEY ("location_address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_club_members_club" RENAME TO "club_members_club_id_idx";

-- RenameIndex
ALTER INDEX "idx_club_members_role" RENAME TO "club_members_role_idx";

-- RenameIndex
ALTER INDEX "idx_club_members_status" RENAME TO "club_members_status_idx";

-- RenameIndex
ALTER INDEX "idx_club_members_user" RENAME TO "club_members_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_clubs_club_plan" RENAME TO "clubs_club_plan_idx";

-- RenameIndex
ALTER INDEX "idx_clubs_invitation_code" RENAME TO "clubs_invitation_code_idx";

-- RenameIndex
ALTER INDEX "idx_clubs_is_public" RENAME TO "clubs_is_public_idx";

-- RenameIndex
ALTER INDEX "idx_clubs_owner" RENAME TO "clubs_owner_id_idx";

-- RenameIndex
ALTER INDEX "idx_comments_commentable" RENAME TO "comments_commentable_type_commentable_id_idx";

-- RenameIndex
ALTER INDEX "idx_comments_created" RENAME TO "comments_created_at_idx";

-- RenameIndex
ALTER INDEX "idx_comments_is_deleted" RENAME TO "comments_is_deleted_idx";

-- RenameIndex
ALTER INDEX "idx_comments_user" RENAME TO "comments_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_event_rsvps_event" RENAME TO "event_rsvps_event_id_idx";

-- RenameIndex
ALTER INDEX "idx_event_rsvps_status" RENAME TO "event_rsvps_status_idx";

-- RenameIndex
ALTER INDEX "idx_event_rsvps_user" RENAME TO "event_rsvps_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_events_club" RENAME TO "events_club_id_idx";

-- RenameIndex
ALTER INDEX "idx_events_created_by" RENAME TO "events_created_by_idx";

-- RenameIndex
ALTER INDEX "idx_events_date" RENAME TO "events_event_date_idx";

-- RenameIndex
ALTER INDEX "idx_events_location_host" RENAME TO "events_location_host_id_idx";

-- RenameIndex
ALTER INDEX "idx_events_status" RENAME TO "events_status_idx";

-- RenameIndex
ALTER INDEX "idx_events_visibility" RENAME TO "events_visibility_idx";

-- RenameIndex
ALTER INDEX "idx_posts_author" RENAME TO "posts_author_type_author_id_idx";

-- RenameIndex
ALTER INDEX "idx_posts_created" RENAME TO "posts_created_at_idx";

-- RenameIndex
ALTER INDEX "idx_posts_is_deleted" RENAME TO "posts_is_deleted_idx";

-- RenameIndex
ALTER INDEX "idx_posts_visibility" RENAME TO "posts_visibility_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_cigar_name" RENAME TO "tastings_cigar_name_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_club" RENAME TO "tastings_club_id_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_created" RENAME TO "tastings_created_at_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_event" RENAME TO "tastings_event_id_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_mode" RENAME TO "tastings_is_expert_mode_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_rating" RENAME TO "tastings_rating_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_user" RENAME TO "tastings_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_tastings_visibility" RENAME TO "tastings_visibility_idx";
