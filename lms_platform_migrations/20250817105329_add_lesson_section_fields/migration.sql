-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resources" JSONB,
ADD COLUMN     "videoType" TEXT DEFAULT 'VIDEO';

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalLessons" INTEGER NOT NULL DEFAULT 0;
