/*
  Warnings:

  - You are about to drop the column `lessonType` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `pdfPages` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `pdfSize` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "lessonType",
DROP COLUMN "pdfPages",
DROP COLUMN "pdfSize";

-- DropEnum
DROP TYPE "LessonType";
