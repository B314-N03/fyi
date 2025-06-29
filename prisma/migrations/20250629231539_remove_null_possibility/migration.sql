/*
  Warnings:

  - Made the column `avatarImageLink` on table `Influencer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Influencer" ALTER COLUMN "avatarImageLink" SET NOT NULL;
