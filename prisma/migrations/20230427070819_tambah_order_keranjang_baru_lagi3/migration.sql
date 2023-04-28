/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Keranjang` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Keranjang_userId_key" ON "Keranjang"("userId");
