/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Produk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Produk_id_userId_key" ON "Produk"("id", "userId");
