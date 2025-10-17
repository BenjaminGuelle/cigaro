-- CreateEnum
CREATE TYPE "LikeableType" AS ENUM ('post', 'comment', 'tasting');

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "likeable_type" "LikeableType" NOT NULL,
    "likeable_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_likeable_type_likeable_id_idx" ON "likes"("likeable_type", "likeable_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_likeable_type_likeable_id_key" ON "likes"("user_id", "likeable_type", "likeable_id");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
