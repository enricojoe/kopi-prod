/*
  Warnings:

  - The values [R101,R102,R103] on the enum `ROLES` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `alamat` on the `User` table. All the data in the column will be lost.
  - Added the required column `namaLengkap` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLES_new" AS ENUM ('U101', 'U102', 'U103');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "ROLES_new"[] USING ("role"::text::"ROLES_new"[]);
ALTER TYPE "ROLES" RENAME TO "ROLES_old";
ALTER TYPE "ROLES_new" RENAME TO "ROLES";
DROP TYPE "ROLES_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ARRAY['U102']::"ROLES"[];
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "alamat",
ADD COLUMN     "active" BOOLEAN DEFAULT true,
ADD COLUMN     "modifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "namaLengkap" TEXT NOT NULL,
ADD COLUMN     "noKoperasi" TEXT,
ALTER COLUMN "role" SET DEFAULT ARRAY['U102']::"ROLES"[];

-- CreateTable
CREATE TABLE "Alamat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "provinsi" TEXT NOT NULL,
    "kabupaten" TEXT,
    "kecamatan" TEXT,
    "kodePos" TEXT,
    "detailAlamat" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Alamat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Alamat_id_key" ON "Alamat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Alamat_userId_key" ON "Alamat"("userId");

-- AddForeignKey
ALTER TABLE "Alamat" ADD CONSTRAINT "Alamat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
