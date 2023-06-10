/*
  Warnings:

  - Made the column `active` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "notifikasiId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "active" SET NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "sudahDibaca" BOOLEAN NOT NULL,
    "urgensi" TEXT NOT NULL DEFAULT 'Tinggi',
    "penerimaId" TEXT NOT NULL,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Notifikasi_id_key" ON "Notifikasi"("id");

-- AddForeignKey
ALTER TABLE "Notifikasi" ADD CONSTRAINT "Notifikasi_penerimaId_fkey" FOREIGN KEY ("penerimaId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_notifikasiId_fkey" FOREIGN KEY ("notifikasiId") REFERENCES "Notifikasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
