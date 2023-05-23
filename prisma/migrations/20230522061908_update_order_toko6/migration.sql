-- DropForeignKey
ALTER TABLE "ItemOrder" DROP CONSTRAINT "ItemOrder_orderTokoId_fkey";

-- AddForeignKey
ALTER TABLE "ItemOrder" ADD CONSTRAINT "ItemOrder_orderTokoId_fkey" FOREIGN KEY ("orderTokoId") REFERENCES "OrderToko"("id") ON DELETE CASCADE ON UPDATE CASCADE;
