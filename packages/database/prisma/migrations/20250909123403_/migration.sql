-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "contentType" TEXT DEFAULT 'VIDEO',
ADD COLUMN     "pdfFileName" TEXT,
ADD COLUMN     "pdfPages" INTEGER,
ADD COLUMN     "pdfSize" INTEGER;
