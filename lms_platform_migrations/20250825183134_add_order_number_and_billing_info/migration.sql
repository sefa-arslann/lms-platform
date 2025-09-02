/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First, add columns as nullable
ALTER TABLE "orders" ADD COLUMN     "billingInfo" JSONB,
ADD COLUMN     "orderNumber" TEXT;

-- Update existing records with unique order numbers
UPDATE "orders" SET "orderNumber" = 'ORD-' || EXTRACT(EPOCH FROM "purchasedAt")::TEXT || '-' || SUBSTRING("id" FROM 1 FOR 8);

-- Make orderNumber NOT NULL
ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
