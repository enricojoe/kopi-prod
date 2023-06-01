import prisma from "../db.js";
import { hashPassword, comparePassword, createJWT } from "../modules/auth.js";
import { uploadImage } from "../config.js";
// Untuk membuat akun
// Request: (note: req.body berarti dari form)
// - Username : req.body.username
// - Password : req.body.password
// - namaLengkap : req.body.nama_lengkap
// - jenisAkun : req.body.jenis_akun
// Response:
// - Token JWT
export const createNewUser = async (req, res, next) => {
    try {
        let role = [];
        if (req.body.jenis_akun === "Pembeli") {
            role.push("R101");
        }
        else if (req.body.jenis_akun === "Toko") {
            role.push("R101", "R102");
        }
        else if (req.body.jenis_akun === "Koperasi") {
            role.push("R101", "R102", "R103", "R104");
        }
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: await hashPassword(req.body.password, 1),
                namaLengkap: req.body.nama_lengkap,
                noIndukKoperasi: req.body.no_induk_koperasi,
                jenisAkun: req.body.jenis_akun,
                role: role
            }
        });
        const keranjang = await prisma.keranjang.create({
            data: {
                userId: user.id,
            },
        });
        const token = createJWT(user);
        res.status(200).json({ token });
    }
    catch (e) {
        next(e);
    }
};
// Untuk masuk
// Request:
// - Username : req.body.username
// - Password : req.body.password
// Response:
// - Token JWT
// - Data user
export const signIn = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: req.body.username
            }
        });
        if (!user) {
            throw new Error("username");
        }
        const isValid = await comparePassword(req.body.password, user.password);
        if (!isValid) {
            throw new Error("password");
        }
        const token = createJWT(user);
        res.json({ token, user });
    }
    catch (e) {
        next(e);
    }
};
// Dapetin profil pengguna
// Request:
// - Username : req.user.id
// Response:
// - Data user + Alamat
export const profile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
            include: {
                alamat: true,
            },
        });
        res.json({ data: user });
    }
    catch (e) {
        next(e);
    }
};
// Update profile pengguna
// Request:
// - id : req.user.id
// - namaLengkap : req.body.nama_lengkap
// - noIndukKoperasi : req.body.no_induk_koperasi
// Response:
// - Data user yang sudah diupdate
export const updateProfile = async (req, res, next) => {
    try {
        var image = undefined;
        if (req.body.gambar !== undefined) {
            image = await uploadImage(req.body.gambar, "user");
        }
        const updateUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                namaLengkap: req.body.nama_lengkap,
                noIndukKoperasi: req.body.no_induk_koperasi,
                noTelpon: req.body.no_telpon,
                deskripsi: req.body.deskripsi,
                gambar: image
            }
        });
        res.json({ data: updateUser });
    }
    catch (e) {
        next(e);
    }
};
// Tambah (jika belum ada), update (jika sudah ada) data alamat
// Request:
// - provinsi: req.body.provinsi
// - kabupaten: req.body.kabupaten
// - kecamatan: req.body.kecamatan
// - kodePos: req.body.kode_post
// - detailAlamat: req.body.detail_alamat
// - latitude: req.body.latitude
// - longitude: req.body.longitude
// Response:
// - Data user dengan alamat yang sudah dibuat/update
export const updateAlamat = async (req, res, next) => {
    try {
        const createAlamat = await prisma.alamat.upsert({
            where: {
                userId: req.user.id,
            },
            create: {
                provinsi: req.body.provinsi,
                kabupaten: req.body.kabupaten,
                kecamatan: req.body.kecamatan,
                kodePos: req.body.kode_post,
                detailAlamat: req.body.detail_alamat,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                userId: req.user.id,
            },
            update: {
                provinsi: req.body.provinsi,
                kabupaten: req.body.kabupaten,
                kecamatan: req.body.kecamatan,
                kodePos: req.body.kode_post,
                detailAlamat: req.body.detail_alamat,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            },
        });
        res.json({ data: createAlamat });
    }
    catch (e) {
        next(e);
    }
};
export const merchant = async (req, res, next) => {
    try {
        const produk = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                produk: true
            }
        });
        res.status(200).json({ data: produk });
    }
    catch (e) {
        next(e);
    }
};
export const merchantInfo = async (req, res, next) => {
    try {
        const belum_bayar = await prisma.orderToko.count({
            where: {
                tokoId: req.user.id,
                order: {
                    statusPembayaran: "MENUNGGU_PEMBAYARAN"
                }
            }
        });
        const perlu_diproses = await prisma.orderToko.count({
            where: {
                statusPesanan: "PESANAN_DITERIMA",
                tokoId: req.user.id,
                order: {
                    statusPembayaran: "PEMBAYARAN_DITERIMA"
                }
            }
        });
        const sedang_diproses = await prisma.orderToko.count({
            where: {
                statusPesanan: "PESANAN_DIPROSES",
                tokoId: req.user.id,
                order: {
                    statusPembayaran: "PEMBAYARAN_DITERIMA"
                }
            }
        });
        const dalam_pengiriman = await prisma.orderToko.count({
            where: {
                statusPesanan: "PESANAN_DIKIRIM",
                tokoId: req.user.id,
                order: {
                    statusPembayaran: "PEMBAYARAN_DITERIMA"
                }
            }
        });
        const produk_habis = await prisma.produk.count({
            where: {
                userId: req.user.id,
                stok: 0
            }
        });
        const produk_terjual = await prisma.produk.groupBy({
            by: ['userId'],
            where: {
                userId: req.user.id
            },
            _sum: {
                terjual: true
            }
        });
        // const toko = await prisma.user.findUnique
        // const order = await prisma.user.findUnique({
        // 	where: {
        // 		id: req.user.id
        // 	}, 
        // 	select: {
        // 		id: true,
        // 		pengunjung: true,
        // 		_count: {
        // 			select: {
        // 				produk: true,
        // 				orderToko: {
        // 					where: {
        // 						order: {
        // 							is: {
        // 								statusPembayaran: "MENUNGGU_PEMBAYARAN"
        // 							}
        // 						}
        // 					}
        // 				}
        // 			}
        // 		}
        // 	}
        // })		
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                pengunjung: true,
                _count: {
                    select: {
                        produk: true
                    }
                }
            }
        });
        const hasil = {
            belum_bayar,
            perlu_diproses,
            sedang_diproses,
            dalam_pengiriman,
            produk_habis,
            produk_terjual,
            user
        };
        res.status(200).json({ data: hasil });
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=user.js.map