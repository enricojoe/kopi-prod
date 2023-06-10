import prisma from "../db.js";
export const createNotification = async (isi) => {
    const notifikasi = await prisma.notifikasi.create({
        data: {
            judul: isi.judul,
            pesan: isi.pesan,
            gambar: isi.gambar,
            jenis: isi.jenis,
            penerimaId: isi.penerimaId,
            orderId: isi.orderId
        }
    });
    return;
};
export const updateNotification = async (req, res, next) => {
    try {
        const update_notifikasi = await prisma.notifikasi.update({
            where: {
                id: req.params.notifikasiId
            },
            data: {
                judul: req.body.judul,
                pesan: req.body.pesan,
                jenis: req.body.jenis,
            }
        });
        res.status(200).json({ data: update_notifikasi, message: "Notifikasi berhasil diperbaharui" });
    }
    catch (e) {
        next(e);
    }
};
export const getNotificationById = async (req, res, next) => {
    try {
        const notifikasi = await prisma.notifikasi.update({
            where: {
                id: req.params.notifikasiId
            },
            data: {
                sudahDibaca: true
            },
            select: {
                judul: true,
                pesan: true,
                gambar: true
            }
        });
        res.status(200).json({ data: notifikasi });
    }
    catch (e) {
        next(e);
    }
};
export const getAllNotification = async (req, res, next) => {
    try {
        const notifikasi = await prisma.notifikasi.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                penerimaId: req.user.id
            }
        });
        res.status(200).json({ data: notifikasi });
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=notifikasi.js.map