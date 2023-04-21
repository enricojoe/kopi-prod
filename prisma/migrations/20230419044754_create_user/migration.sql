/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alamat` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ROLES" AS ENUM ('R101', 'R102', 'R103');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "role" "ROLES"[] DEFAULT ARRAY['R102']::"ROLES"[];

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
