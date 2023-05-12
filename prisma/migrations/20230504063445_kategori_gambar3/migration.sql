/*
  Warnings:

  - Made the column `gambar` on table `Kategori` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Kategori" ALTER COLUMN "gambar" SET NOT NULL;
