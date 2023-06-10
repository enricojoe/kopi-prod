/*
  Warnings:

  - Changed the type of `jenis` on the `Notifikasi` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Notifikasi" DROP COLUMN "jenis",
ADD COLUMN     "jenis" "JENIS_NOTIFIKASI" NOT NULL;
