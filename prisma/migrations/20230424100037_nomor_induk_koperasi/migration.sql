/*
  Warnings:

  - You are about to drop the column `noKoperasi` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "noKoperasi",
ADD COLUMN     "noIndukKoperasi" TEXT;
