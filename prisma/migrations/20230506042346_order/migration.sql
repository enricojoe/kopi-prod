/*
  Warnings:

  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS_ORDER" AS ENUM ('MENUNGGU_PEMBAYARAN', 'PESANAN_DIPROSES', 'PESANAN_DIKIRIM');

-- AlterTable
ALTER TABLE "ItemKeranjang" ALTER COLUMN "subTotal" SET DEFAULT 0,
ALTER COLUMN "subTotal" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "STATUS_ORDER" NOT NULL DEFAULT 'MENUNGGU_PEMBAYARAN',
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ItemOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produkId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kuantitas" INTEGER NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemOrder_id_key" ON "ItemOrder"("id");

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
