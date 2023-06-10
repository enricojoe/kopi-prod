/*
  Warnings:

  - You are about to drop the column `notifikasiId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Notifikasi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Notifikasi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_notifikasiId_fkey";

-- AlterTable
ALTER TABLE "Notifikasi" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "notifikasiId";

-- CreateIndex
CREATE UNIQUE INDEX "Notifikasi_orderId_key" ON "Notifikasi"("orderId");

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
