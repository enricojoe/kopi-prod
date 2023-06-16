/*
  Warnings:

  - Added the required column `kodePos` to the `Desa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Desa" ADD COLUMN     "kodePos" TEXT NOT NULL;
