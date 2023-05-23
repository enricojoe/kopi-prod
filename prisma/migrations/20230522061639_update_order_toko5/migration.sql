-- DropForeignKey
ALTER TABLE "OrderToko" DROP CONSTRAINT "OrderToko_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderToko" DROP CONSTRAINT "OrderToko_tokoId_fkey";

-- AddForeignKey
ALTER TABLE "OrderToko" ADD CONSTRAINT "OrderToko_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderToko" ADD CONSTRAINT "OrderToko_tokoId_fkey" FOREIGN KEY ("tokoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
