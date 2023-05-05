-- DropIndex
DROP INDEX "ItemKeranjang_produkId_keranjangId_key";

-- AlterTable
ALTER TABLE "ItemKeranjang" ADD CONSTRAINT "ItemKeranjang_pkey" PRIMARY KEY ("produkId", "keranjangId");

-- AlterTable
ALTER TABLE "ProdukKategori" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
