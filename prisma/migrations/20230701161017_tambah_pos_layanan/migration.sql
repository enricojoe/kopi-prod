-- CreateTable
CREATE TABLE "LayananPengiriman" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceCode" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "feeTax" DOUBLE PRECISION NOT NULL,
    "insurance" DOUBLE PRECISION NOT NULL,
    "insuranceTax" DOUBLE PRECISION NOT NULL,
    "totalFee" DOUBLE PRECISION NOT NULL,
    "itemValue" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,
    "orderTokoId" TEXT NOT NULL,

    CONSTRAINT "LayananPengiriman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LayananPengiriman_id_key" ON "LayananPengiriman"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LayananPengiriman_orderTokoId_key" ON "LayananPengiriman"("orderTokoId");

-- AddForeignKey
ALTER TABLE "LayananPengiriman" ADD CONSTRAINT "LayananPengiriman_orderTokoId_fkey" FOREIGN KEY ("orderTokoId") REFERENCES "OrderToko"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
