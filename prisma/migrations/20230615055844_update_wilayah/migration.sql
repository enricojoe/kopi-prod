-- CreateTable
CREATE TABLE "Provinsi" (
    "kode" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,

    CONSTRAINT "Provinsi_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "Kabupaten" (
    "kode" TEXT NOT NULL,
    "kodeKabupaten" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kodeProvinsi" TEXT NOT NULL,

    CONSTRAINT "Kabupaten_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "Kecamatan" (
    "kode" TEXT NOT NULL,
    "kodeKecamatan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kodeKabupaten" TEXT NOT NULL,

    CONSTRAINT "Kecamatan_pkey" PRIMARY KEY ("kode")
);

-- CreateTable
CREATE TABLE "Desa" (
    "kode" TEXT NOT NULL,
    "kodeDesa" TEXT NOT NULL,
    "desa" TEXT NOT NULL,
    "kodeKecamatan" TEXT NOT NULL,

    CONSTRAINT "Desa_pkey" PRIMARY KEY ("kode")
);

-- AddForeignKey
ALTER TABLE "Kabupaten" ADD CONSTRAINT "Kabupaten_kodeProvinsi_fkey" FOREIGN KEY ("kodeProvinsi") REFERENCES "Provinsi"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kecamatan" ADD CONSTRAINT "Kecamatan_kodeKabupaten_fkey" FOREIGN KEY ("kodeKabupaten") REFERENCES "Kabupaten"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Desa" ADD CONSTRAINT "Desa_kodeKecamatan_fkey" FOREIGN KEY ("kodeKecamatan") REFERENCES "Kecamatan"("kode") ON DELETE RESTRICT ON UPDATE CASCADE;
