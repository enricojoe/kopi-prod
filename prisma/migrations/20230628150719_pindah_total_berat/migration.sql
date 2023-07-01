/*
  Warnings:

  - You are about to drop the column `totalBerat` on the `ItemOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemOrder" DROP COLUMN "totalBerat";

-- AlterTable
ALTER TABLE "OrderToko" ADD COLUMN     "totalBerat" DOUBLE PRECISION NOT NULL DEFAULT 0;
