/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[produkId,keranjangId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_id_key";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Order_produkId_keranjangId_key" ON "Order"("produkId", "keranjangId");
