-- CreateTable
CREATE TABLE "GambarProduk" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gambar" BYTEA NOT NULL,
    "produkId" TEXT NOT NULL,

    CONSTRAINT "GambarProduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GambarProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gambar" BYTEA NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GambarProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GambarProduk_id_key" ON "GambarProduk"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GambarProfile_id_key" ON "GambarProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GambarProfile_userId_key" ON "GambarProfile"("userId");

-- AddForeignKey
ALTER TABLE "GambarProduk" ADD CONSTRAINT "GambarProduk_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GambarProfile" ADD CONSTRAINT "GambarProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
