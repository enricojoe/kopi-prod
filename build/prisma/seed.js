import { PrismaClient } from '@prisma/client';
import provinsi from "./seeds/provinsi.js";
import kabupaten from "./seeds/kabupaten.js";
import kecamatan from "./seeds/kecamatan.js";
import desa from "./seeds/desa.js";
const prisma = new PrismaClient();
async function main() {
    // Do stuff
    const data_provinsi = await provinsi();
    await prisma.provinsi.createMany({
        data: data_provinsi
    });
    const data_kabupaten = await kabupaten();
    await prisma.kabupaten.createMany({
        data: data_kabupaten
    });
    const data_kecamatan = await kecamatan();
    await prisma.kecamatan.createMany({
        data: data_kecamatan
    });
    const data_desa = await desa();
    await prisma.desa.createMany({
        data: data_desa
    });
    console.log("Seed berhasil");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map