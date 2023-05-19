/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "STATUS_PESANAN" AS ENUM ('PESANAN_DITERIMA', 'PESANAN_DIPROSES', 'PESANAN_DIKIRIM', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "STATUS_PEMBAYARAN" AS ENUM ('MENUNGGU_PEMBAYARAN', 'PEMBAYARAN_DITERIMA', 'PEMBAYARAN_DIBATALKAN');

-- AlterTable
ALTER TABLE "ItemOrder" ADD COLUMN     "orderTokoId" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "statusPembayaran" "STATUS_PEMBAYARAN" NOT NULL DEFAULT 'MENUNGGU_PEMBAYARAN';

-- DropEnum
DROP TYPE "STATUS_ORDER";

-- CreateTable
CREATE TABLE "OrderToko" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "tokoId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "statusPesanan" "STATUS_PESANAN" NOT NULL DEFAULT 'PESANAN_DITERIMA',

    CONSTRAINT "OrderToko_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderToko_id_key" ON "OrderToko"("id");

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_orderTokoId_fkey" FOREIGN KEY ("orderTokoId") REFERENCES "OrderToko"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderToko" ADD CONSTRAINT "OrderToko_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderToko" ADD CONSTRAINT "OrderToko_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
