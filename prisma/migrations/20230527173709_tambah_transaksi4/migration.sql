/*
  Warnings:

  - Made the column `terjual` on table `Produk` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "biayaLayanan" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "biayaTransaksi" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderToko" ADD COLUMN     "ongkosKirim" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Produk" ADD COLUMN     "berat" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "terjual" SET NOT NULL;
