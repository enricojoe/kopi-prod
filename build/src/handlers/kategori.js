import prisma from "../db.js";
import redis from "../modules/redis.js";
import { uploadImage } from "../config.js";
export const createCategory = async (req, res, next) => {
    try {
        const image = await uploadImage(req.body.gambar, "kategori");
        const kategori = await prisma.kategori.create({
            data: {
                kategori: req.body.kategori,
                deskripsi: req.body.deskripsi,
                gambar: image
            }
        });
        res.json({ data: kategori });
    }
    catch (e) {
        next(e);
    }
};
export const getAllCategory = async (req, res, next) => {
    try {
        const kategori = await prisma.kategori.findMany();
        redis.caching(req.originalUrl, kategori);
        redis.setExpire(req.originalUrl, 60 * 60);
        res.status(200).json({ data: kategori });
    }
    catch (e) {
        next(e);
    }
};
export const getCategoryProduct = async (req, res, next) => {
    try {
        const kategori = await prisma.kategori.findUnique({
            where: {
                id: req.params.kategoriId
            },
            select: {
                id: true,
                kategori: true,
                deskripsi: true,
                gambar: true
            }
        });
        var urut = {};
        if (req.query.urut === "terbaru") {
            urut["createdAt"] = "desc";
        }
        else if (req.query.urut === "terlaris") {
            urut["terjual"] = "desc";
        }
        else if (req.query.urut === "termahal") {
            urut["harga"] = "desc";
        }
        else if (req.query.urut === "termurah") {
            urut["harga"] = "asc";
        }
        const produk_kategori = await prisma.produk.findMany({
            orderBy: urut,
            where: {
                kategori_produk: {
                    some: {
                        kategori: {
                            is: {
                                id: req.params.kategoriId
                            }
                        }
                    }
                }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        namaLengkap: true,
                    },
                },
                id: true,
                namaProduk: true,
                gambar: true,
                harga: true,
                kategori_produk: {
                    select: {
                        kategori: {
                            select: {
                                id: true,
                                kategori: true,
                                deskripsi: true,
                                gambar: true
                            }
                        }
                    }
                }
            }
        });
        redis.caching(req.originalUrl, { kategori, produk_kategori });
        redis.setExpire(req.originalUrl);
        res.status(200).json({ data: { kategori, produk_kategori } });
    }
    catch (e) {
        next(e);
    }
};
export const updateCategory = async (req, res, next) => {
    try {
        if (req.body.gambar) {
            const image = await uploadImage(req.body.gambar, "kategori");
            const updated = await prisma.kategori.update({
                where: {
                    id: req.params.kategoriId
                },
                data: {
                    kategori: req.body.kategori,
                    deskripsi: req.body.deskripsi,
                    gambar: image
                }
            });
            res.json({ data: updated });
        }
        else {
            const updated = await prisma.kategori.update({
                where: {
                    id: req.params.kategoriId
                },
                data: {
                    kategori: req.body.kategori,
                    deskripsi: req.body.deskripsi
                }
            });
            res.json({ data: updated });
        }
    }
    catch (e) {
        next(e);
    }
};
export const deleteCategory = async (req, res, next) => {
    try {
        const deleted = await prisma.kategori.delete({
            where: {
                id: req.params.kategoriId
            }
        });
        res.json({ data: deleted });
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=kategori.js.map