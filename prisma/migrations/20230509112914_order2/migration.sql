/*
  Warnings:

  - You are about to drop the column `subTotal` on the `ItemOrder` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "STATUS_ORDER" ADD VALUE 'DIBATALKAN';

-- AlterTable
ALTER TABLE "ItemOrder" DROP COLUMN "subTotal";
