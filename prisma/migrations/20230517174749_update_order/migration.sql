/*
  Warnings:

  - The primary key for the `ItemOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ItemOrder` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ItemOrder_id_key";

-- AlterTable
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "subTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "kuantitas" SET DEFAULT 0,
ADD CONSTRAINT "ItemOrder_pkey" PRIMARY KEY ("produkId", "orderId");

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "metodePembayaran" TEXT NOT NULL DEFAULT 'COD';
