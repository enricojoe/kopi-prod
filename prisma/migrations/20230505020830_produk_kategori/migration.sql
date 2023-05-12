/*
  Warnings:

  - You are about to drop the column `produkId` on the `Kategori` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kategori" DROP CONSTRAINT "Kategori_produkId_fkey";

-- DropIndex
DROP INDEX "Produk_id_userId_key";

-- AlterTable
ALTER TABLE "Kategori" DROP COLUMN "produkId";

-- CreateTable
CREATE TABLE "ProdukKategori" (
    "produkId" TEXT NOT NULL,
    "kategoriId" TEXT NOT NULL,

    CONSTRAINT "ProdukKategori_pkey" PRIMARY KEY ("produkId","kategoriId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_key" ON "Order"("userId");

-- AddForeignKey
ALTER TABLE "ProdukKategori" ADD CONSTRAINT "ProdukKategori_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdukKategori" ADD CONSTRAINT "ProdukKategori_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
