/*
  Warnings:

  - You are about to drop the column `semesterId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `semesters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_semesterId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "semesterId";

-- DropTable
DROP TABLE "semesters";
