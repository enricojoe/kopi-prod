import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // Do stuff
    // await prisma.playlist.createMany({
    //    data: playlists,
    // });
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