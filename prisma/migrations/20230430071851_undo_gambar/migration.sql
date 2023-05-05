/*
  Warnings:

  - You are about to drop the `GambarProduk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GambarProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GambarProduk" DROP CONSTRAINT "GambarProduk_produkId_fkey";

-- DropForeignKey
ALTER TABLE "GambarProfile" DROP CONSTRAINT "GambarProfile_userId_fkey";

-- DropTable
DROP TABLE "GambarProduk";

-- DropTable
DROP TABLE "GambarProfile";
