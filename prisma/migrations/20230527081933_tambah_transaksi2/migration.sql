/*
  Warnings:

  - Added the required column `vaNumber` to the `TransaksiOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransaksiOrder" ADD COLUMN     "vaNumber" TEXT NOT NULL;
