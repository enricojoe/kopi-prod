/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_keranjangId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_produkId_fkey";

-- DropTable
DROP TABLE "Order";

-- CreateTable
CREATE TABLE "ItemKeranjang" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produkId" TEXT NOT NULL,
    "keranjangId" TEXT NOT NULL,
    "kuantitas" INTEGER NOT NULL DEFAULT 0,
    "subTotal" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemKeranjang_produkId_keranjangId_key" ON "ItemKeranjang"("produkId", "keranjangId");

-- AddForeignKey
ALTER TABLE "ItemKeranjang" ADD CONSTRAINT "ItemKeranjang_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemKeranjang" ADD CONSTRAINT "ItemKeranjang_keranjangId_fkey" FOREIGN KEY ("keranjangId") REFERENCES "Keranjang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
