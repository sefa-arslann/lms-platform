-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'PDF', 'QUIZ', 'TEXT');

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "lessonType" "LessonType" NOT NULL DEFAULT 'VIDEO',
ADD COLUMN     "pdfKey" TEXT,
ADD COLUMN     "pdfPages" INTEGER,
ADD COLUMN     "pdfSize" INTEGER,
ADD COLUMN     "pdfUrl" TEXT;
