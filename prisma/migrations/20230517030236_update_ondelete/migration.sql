-- DropForeignKey
ALTER TABLE "ItemKeranjang" DROP CONSTRAINT "ItemKeranjang_produkId_fkey";

-- DropForeignKey
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_produkId_fkey";

-- DropForeignKey
ALTER TABLE "ProdukKategori" DROP CONSTRAINT "ProdukKategori_kategoriId_fkey";

-- DropForeignKey
ALTER TABLE "ProdukKategori" DROP CONSTRAINT "ProdukKategori_produkId_fkey";

-- AddForeignKey
ALTER TABLE "ProdukKategori" ADD CONSTRAINT "ProdukKategori_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdukKategori" ADD CONSTRAINT "ProdukKategori_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemKeranjang" ADD CONSTRAINT "ItemKeranjang_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
