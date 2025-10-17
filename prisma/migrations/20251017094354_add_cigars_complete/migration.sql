/*
  Warnings:

  - You are about to drop the column `cigar_brand` on the `tastings` table. All the data in the column will be lost.
  - You are about to drop the column `cigar_name` on the `tastings` table. All the data in the column will be lost.
  - You are about to drop the column `vitola` on the `tastings` table. All the data in the column will be lost.
  - Added the required column `cigar_id` to the `tastings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AwardType" AS ENUM ('cigar_of_month', 'cigar_of_quarter', 'cigar_of_year', 'trending_cigar', 'discovery_cigar');

-- DropIndex
DROP INDEX "public"."tastings_cigar_name_idx";

-- AlterTable
ALTER TABLE "tastings" DROP COLUMN "cigar_brand",
DROP COLUMN "cigar_name",
DROP COLUMN "vitola",
ADD COLUMN     "cigar_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "cigars" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "line" VARCHAR(100),
    "fullName" VARCHAR(300) NOT NULL,
    "vitola" VARCHAR(100),
    "length" INTEGER,
    "ring_gauge" INTEGER,
    "smoking_time" INTEGER,
    "country" VARCHAR(100),
    "region" VARCHAR(100),
    "factory" VARCHAR(100),
    "wrapper" VARCHAR(100),
    "binder" VARCHAR(100),
    "filler" VARCHAR(200),
    "strength" VARCHAR(50),
    "body" VARCHAR(50),
    "flavor_profile" VARCHAR(300),
    "year" INTEGER,
    "is_limited_edition" BOOLEAN NOT NULL DEFAULT false,
    "production_status" VARCHAR(50),
    "msrp_price" DOUBLE PRECISION,
    "currency" VARCHAR(3),
    "availability" VARCHAR(50),
    "photos" TEXT[],
    "official_description" TEXT,
    "average_rating" DOUBLE PRECISION DEFAULT 0,
    "total_tastings" INTEGER NOT NULL DEFAULT 0,
    "total_users" INTEGER NOT NULL DEFAULT 0,
    "last_tasting_at" TIMESTAMPTZ(6),
    "popularity_rank" INTEGER,
    "rating_rank" INTEGER,
    "trending_score" DOUBLE PRECISION DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "verified_by" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cigars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cigar_awards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cigar_id" UUID NOT NULL,
    "award_type" "AwardType" NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "quarter" INTEGER,
    "average_rating" DOUBLE PRECISION NOT NULL,
    "total_tastings" INTEGER NOT NULL,
    "total_users" INTEGER NOT NULL,
    "trending_score" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "awarded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cigar_awards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cigars_brand_idx" ON "cigars"("brand");

-- CreateIndex
CREATE INDEX "cigars_fullName_idx" ON "cigars"("fullName");

-- CreateIndex
CREATE INDEX "cigars_country_idx" ON "cigars"("country");

-- CreateIndex
CREATE INDEX "cigars_strength_idx" ON "cigars"("strength");

-- CreateIndex
CREATE INDEX "cigars_average_rating_idx" ON "cigars"("average_rating");

-- CreateIndex
CREATE INDEX "cigars_total_tastings_idx" ON "cigars"("total_tastings");

-- CreateIndex
CREATE INDEX "cigars_popularity_rank_idx" ON "cigars"("popularity_rank");

-- CreateIndex
CREATE INDEX "cigars_rating_rank_idx" ON "cigars"("rating_rank");

-- CreateIndex
CREATE INDEX "cigars_is_verified_idx" ON "cigars"("is_verified");

-- CreateIndex
CREATE INDEX "cigars_is_public_idx" ON "cigars"("is_public");

-- CreateIndex
CREATE INDEX "cigars_created_by_idx" ON "cigars"("created_by");

-- CreateIndex
CREATE INDEX "cigars_year_idx" ON "cigars"("year");

-- CreateIndex
CREATE UNIQUE INDEX "cigars_brand_name_vitola_key" ON "cigars"("brand", "name", "vitola");

-- CreateIndex
CREATE INDEX "cigar_awards_cigar_id_idx" ON "cigar_awards"("cigar_id");

-- CreateIndex
CREATE INDEX "cigar_awards_award_type_idx" ON "cigar_awards"("award_type");

-- CreateIndex
CREATE INDEX "cigar_awards_year_month_idx" ON "cigar_awards"("year", "month");

-- CreateIndex
CREATE INDEX "cigar_awards_is_active_idx" ON "cigar_awards"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "cigar_awards_award_type_year_month_key" ON "cigar_awards"("award_type", "year", "month");

-- CreateIndex
CREATE INDEX "tastings_cigar_id_idx" ON "tastings"("cigar_id");

-- AddForeignKey
ALTER TABLE "cigars" ADD CONSTRAINT "cigars_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cigars" ADD CONSTRAINT "cigars_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cigar_awards" ADD CONSTRAINT "cigar_awards_cigar_id_fkey" FOREIGN KEY ("cigar_id") REFERENCES "cigars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_cigar_id_fkey" FOREIGN KEY ("cigar_id") REFERENCES "cigars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
