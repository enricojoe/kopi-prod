/*
  Warnings:

  - You are about to drop the column `total` on the `OrderToko` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderToko" DROP COLUMN "total",
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0;
