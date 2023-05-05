/*
  Warnings:

  - You are about to drop the column `kategori` on the `Produk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Produk" DROP COLUMN "kategori";

-- CreateTable
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kategori" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "produkId" TEXT,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_id_key" ON "Kategori"("id");

-- AddForeignKey
ALTER TABLE "Kategori" ADD CONSTRAINT "Kategori_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
