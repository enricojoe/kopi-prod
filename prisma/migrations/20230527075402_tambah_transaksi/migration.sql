-- CreateTable
CREATE TABLE "TransaksiOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "statusCode" TEXT NOT NULL,
    "statusMessage" TEXT NOT NULL,
    "totalPembayaran" DOUBLE PRECISION NOT NULL,
    "metodePembayaran" TEXT NOT NULL,
    "statusTransaksi" TEXT NOT NULL,
    "waktuTransaksi" TIMESTAMP(3) NOT NULL,
    "pdf" TEXT,
    "fraudStatus" TEXT NOT NULL,
    "bank" TEXT,

    CONSTRAINT "TransaksiOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransaksiOrder_id_key" ON "TransaksiOrder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TransaksiOrder_orderId_key" ON "TransaksiOrder"("orderId");

-- AddForeignKey
ALTER TABLE "TransaksiOrder" ADD CONSTRAINT "TransaksiOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
