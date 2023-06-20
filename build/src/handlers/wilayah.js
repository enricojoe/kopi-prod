import prisma from "../db.js";
import redis from "../modules/redis.js";
export const getProvinces = async (req, res, next) => {
    try {
        const provinsi = await prisma.provinsi.findMany();
        redis.caching(req.originalUrl, provinsi);
        res.status(200).json({ data: provinsi });
    }
    catch (e) {
        next(e);
    }
};
export const getRegencies = async (req, res, next) => {
    try {
        var kabupaten = [];
        if (req.query.provinsi !== undefined) {
            kabupaten = await prisma.kabupaten.findMany({
                where: {
                    kodeProvinsi: req.query.provinsi
                }
            });
        }
        redis.caching(req.originalUrl, kabupaten);
        res.status(200).json({ data: kabupaten });
    }
    catch (e) {
        next(e);
    }
};
export const getDistricts = async (req, res, next) => {
    try {
        var kecamatan = [];
        if (req.query.kabupaten !== undefined) {
            kecamatan = await prisma.kecamatan.findMany({
                where: {
                    kodeKabupaten: req.query.kabupaten
                }
            });
        }
        redis.caching(req.originalUrl, kecamatan);
        res.status(200).json({ data: kecamatan });
    }
    catch (e) {
        next(e);
    }
};
export const getVillages = async (req, res, next) => {
    try {
        var desa = [];
        if (req.query.kecamatan !== undefined) {
            desa = await prisma.desa.findMany({
                where: {
                    kodeKecamatan: req.query.kecamatan
                }
            });
        }
        redis.caching(req.originalUrl, desa);
        res.status(200).json({ data: desa });
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=wilayah.js.map