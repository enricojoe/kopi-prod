/*
  Warnings:

  - The primary key for the `ItemOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `ItemOrder` table. All the data in the column will be lost.
  - Made the column `orderTokoId` on table `ItemOrder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_orderTokoId_fkey";

-- AlterTable
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_pkey",
DROP COLUMN "orderId",
ALTER COLUMN "orderTokoId" SET NOT NULL,
ADD CONSTRAINT "ItemOrder_pkey" PRIMARY KEY ("produkId", "orderTokoId");

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_orderTokoId_fkey" FOREIGN KEY ("orderTokoId") REFERENCES "OrderToko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
