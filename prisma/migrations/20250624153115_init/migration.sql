/*
  Warnings:

  - You are about to drop the column `category` on the `Influencer` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Influencer` table. All the data in the column will be lost.
  - The `platform` column on the `Influencer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `age` to the `Influencer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgComments` to the `Influencer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avgLikes` to the `Influencer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engagementRate` to the `Influencer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers` to the `Influencer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Influencer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Influencer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Influencer" DROP COLUMN "category",
DROP COLUMN "profileImage",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "avgComments" INTEGER NOT NULL,
ADD COLUMN     "avgLikes" INTEGER NOT NULL,
ADD COLUMN     "engagementRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "followers" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "topics" TEXT[],
DROP COLUMN "platform",
ADD COLUMN     "platform" TEXT[];
