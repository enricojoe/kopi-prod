-- CreateTable
CREATE TABLE "Produk" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "namaProduk" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "sku" TEXT,
    "kategori" TEXT[],
    "harga" DOUBLE PRECISION NOT NULL,
    "stok" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produk_id_key" ON "Produk"("id");

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
