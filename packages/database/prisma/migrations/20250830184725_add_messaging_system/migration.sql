/*
  Warnings:

  - You are about to drop the column `mediaId` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "mediaId";

-- DropTable
DROP TABLE "media";
