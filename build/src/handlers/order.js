import prisma from "../db.js";
import snap from "../midtrans.js";
import { getFee } from "../modules/pos.js";
export const tes = async (req, res, next) => {
    const postalCode = await getFee();
    res.json(postalCode);
};
// item order (per produk => produk, kuantitas pesanan)
// order (per toko dan disertai pengiriman => kumpulan item order, total/sub total, status, metode pengiriman)
// transaksi (dengan pembayaran => kumpulan order, total keseluruhan, metode pembayaran, status)
export const createOrder = async (req, res, next) => {
    try {
        const id_produk = req.body.id_produk_keranjang;
        const toko_produk = await prisma.user.findMany({
            where: {
                produk: {
                    some: {
                        id: {
                            in: id_produk
                        }
                    }
                }
            },
            select: {
                id: true,
                produk: {
                    where: {
                        id: {
                            in: id_produk
                        },
                        itemKeranjang: {
                            some: {
                                Keranjang: {
                                    userId: req.user.id
                                }
                            }
                        }
                    },
                    select: {
                        id: true,
                        itemKeranjang: {
                            where: {
                                Keranjang: {
                                    userId: req.user.id
                                }
                            },
                            select: {
                                kuantitas: true,
                                subTotal: true
                            }
                        }
                    }
                }
            }
        });
        var total = 0;
        var jumlah_toko = toko_produk.length;
        const order_toko = toko_produk.map(toko => {
            var subTotalToko = 0;
            var list_item = toko.produk.map(item => {
                subTotalToko += item.itemKeranjang[0].subTotal;
                return {
                    produkId: item.id,
                    kuantitas: item.itemKeranjang[0].kuantitas,
                    subTotal: item.itemKeranjang[0].subTotal
                };
            });
            total += subTotalToko;
            return {
                tokoId: toko.id,
                subTotal: subTotalToko,
                itemOrder: {
                    create: list_item
                }
            };
        });
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                total: total,
                metodePembayaran: req.body.metode_pembayaran,
                biayaLayanan: parseFloat(req.body.biayaLayanan),
                biayaTransaksi: parseFloat(req.body.biayaTransaksi),
                orderToko: {
                    create: order_toko
                }
            },
            select: {
                id: true,
                userId: true,
                total: true,
                biayaTransaksi: true,
                biayaLayanan: true,
                metodePembayaran: true,
                orderToko: {
                    select: {
                        tokoId: true,
                        subTotal: true,
                        itemOrder: {
                            select: {
                                produkId: true,
                                kuantitas: true,
                                subTotal: true
                            }
                        }
                    }
                }
            }
        });
        order_toko.forEach(async (toko) => {
            await prisma.user.update({
                where: {
                    id: toko.tokoId
                },
                data: {
                    produk: {
                        update: toko.itemOrder.create.map(item => {
                            return {
                                where: {
                                    id: item.produkId
                                },
                                data: {
                                    stok: {
                                        decrement: item.kuantitas
                                    }
                                }
                            };
                        })
                    }
                }
            });
        });
        total = order.total + order.biayaLayanan + order.biayaTransaksi + (20000 * jumlah_toko);
        if (order.metodePembayaran !== "COD") {
            const parameter = {
                transaction_details: {
                    order_id: order.id,
                    gross_amount: total
                },
                customer_details: {
                    first_name: "Pembayaran",
                    last_name: "Sikopi"
                }
            };
            await snap.createTransaction(parameter).then(async (transaction) => {
                await prisma.order.update({
                    where: {
                        id: order.id
                    },
                    data: {
                        token: transaction.token
                    }
                });
            });
        }
        res.json({ data: order });
    }
    catch (e) {
        next(e);
    }
};
export const transactionResult = async (req, res, next) => {
    try {
        const status = req.body.transaction_status;
        const transaksi = await prisma.transaksiOrder.upsert({
            where: {
                orderId: req.body.order_id
            },
            create: {
                orderId: req.body.order_id,
                statusCode: req.body.status_code,
                statusMessage: req.body.status_message,
                totalPembayaran: parseFloat(req.body.gross_amount),
                metodePembayaran: req.body.payment_type,
                statusTransaksi: status,
                waktuTransaksi: req.body.transaction_time,
                pdf: req.body.pdf_url,
                fraudStatus: req.body.fraud_status,
                bank: req.body.bank || (req.body.va_numbers ? req.body.va_numbers[0].bank : undefined),
                vaNumber: (req.body.va_numbers ? req.body.va_numbers[0].va_number : undefined)
            },
            update: {
                orderId: req.body.order_id,
                statusCode: req.body.status_code,
                statusMessage: req.body.status_message,
                totalPembayaran: parseFloat(req.body.gross_amount),
                metodePembayaran: req.body.payment_type,
                statusTransaksi: status,
                waktuTransaksi: req.body.transaction_time,
                pdf: req.body.pdf_url,
                fraudStatus: req.body.fraud_status,
                bank: req.body.bank || (req.body.va_numbers ? req.body.va_numbers[0].bank : undefined),
                vaNumber: (req.body.va_numbers ? req.body.va_numbers[0].va_number : undefined)
            },
            select: {
                order: {
                    select: {
                        orderToko: {
                            select: {
                                id: true,
                                tokoId: true,
                                itemOrder: {
                                    select: {
                                        produkId: true,
                                        kuantitas: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if ((status === "settlement") || (status === "capture")) {
            await prisma.order.update({
                where: {
                    id: req.body.order_id
                },
                data: {
                    statusPembayaran: "PEMBAYARAN_DITERIMA"
                }
            });
            transaksi.order.orderToko.forEach(async (toko) => {
                await prisma.user.update({
                    where: {
                        id: toko.tokoId
                    },
                    data: {
                        produk: {
                            update: toko.itemOrder.map(item => {
                                return {
                                    where: {
                                        id: item.produkId
                                    },
                                    data: {
                                        terjual: {
                                            increment: item.kuantitas
                                        }
                                    }
                                };
                            })
                        }
                    }
                });
            });
            res.status(200).json({ message: "Pembayaran Diterima" });
        }
        else if (status === "cancel") {
            await prisma.order.update({
                where: {
                    id: req.body.order_id
                },
                data: {
                    statusPembayaran: "PEMBAYARAN_DIBATALKAN",
                    orderToko: {
                        updateMany: {
                            where: {
                                orderId: req.body.order_id
                            },
                            data: {
                                statusPesanan: "DIBATALKAN"
                            }
                        }
                    }
                }
            });
            transaksi.order.orderToko.forEach(async (toko) => {
                await prisma.user.update({
                    where: {
                        id: toko.tokoId
                    },
                    data: {
                        produk: {
                            update: toko.itemOrder.map(item => {
                                return {
                                    where: {
                                        id: item.produkId
                                    },
                                    data: {
                                        stok: {
                                            increment: item.kuantitas
                                        }
                                    }
                                };
                            })
                        }
                    }
                });
            });
            res.status(200).json({ message: "Pembayaran Dibatalkan" });
        }
        else if (status === "expired") {
            await prisma.order.update({
                where: {
                    id: req.body.order_id
                },
                data: {
                    statusPembayaran: "PEMBAYARAN_KADALUARSA",
                    orderToko: {
                        updateMany: {
                            where: {
                                orderId: req.body.order_id
                            },
                            data: {
                                statusPesanan: "DIBATALKAN"
                            }
                        }
                    }
                }
            });
            transaksi.order.orderToko.forEach(async (toko) => {
                await prisma.user.update({
                    where: {
                        id: toko.tokoId
                    },
                    data: {
                        produk: {
                            update: toko.itemOrder.map(item => {
                                return {
                                    where: {
                                        id: item.produkId
                                    },
                                    data: {
                                        stok: {
                                            increment: item.kuantitas
                                        }
                                    }
                                };
                            })
                        }
                    }
                });
            });
            res.status(200).json({ message: "Pembayaran Kadaluarsa" });
        }
        else if (status === "pending") {
            res.status(200).json({ message: "Menunggu Pembayaran" });
        }
        else {
            res.status(400).json({ message: "Status tidak diketahui" });
        }
    }
    catch (e) {
        next(e);
    }
};
// Toko ambil detail dari order user
export const getUserOrderDetail = async (req, res, next) => {
    try {
        const detail_order = await prisma.orderToko.findUnique({
            where: {
                id: req.params.orderTokoId
            },
            select: {
                order: {
                    select: {
                        id: true,
                        createdAt: true,
                        statusPembayaran: true,
                        user: {
                            select: {
                                id: true,
                                namaLengkap: true,
                                noTelpon: true,
                                alamat: {
                                    select: {
                                        provinsi: true,
                                        kabupaten: true,
                                        kecamatan: true,
                                        detailAlamat: true,
                                        kodePos: true
                                    }
                                }
                            }
                        },
                    }
                },
                noResi: true,
                subTotal: true,
                statusPesanan: true,
                itemOrder: {
                    select: {
                        produk: {
                            select: {
                                id: true,
                                namaProduk: true,
                                harga: true,
                                gambar: true
                            }
                        },
                        kuantitas: true,
                        subTotal: true
                    }
                }
            }
        });
        res.status(200).json({ data: detail_order });
    }
    catch (e) {
        next(e);
    }
};
export const cancelOrder = async (req, res, next) => {
    try {
        const order_dibatalkan = await prisma.order.update({
            where: {
                id: req.params.orderId
            },
            data: {
                statusPembayaran: "PEMBAYARAN_DIBATALKAN",
                orderToko: {
                    updateMany: {
                        where: {
                            orderId: req.params.orderId
                        },
                        data: {
                            statusPesanan: "DIBATALKAN"
                        }
                    }
                }
            },
            select: {
                orderToko: {
                    select: {
                        tokoId: true,
                        itemOrder: {
                            select: {
                                produkId: true,
                                kuantitas: true
                            }
                        }
                    }
                }
            }
        });
        order_dibatalkan.orderToko.forEach(async (toko) => {
            await prisma.user.update({
                where: {
                    id: toko.tokoId
                },
                data: {
                    produk: {
                        update: toko.itemOrder.map(item => {
                            return {
                                where: {
                                    id: item.produkId
                                },
                                data: {
                                    stok: {
                                        increment: item.kuantitas
                                    }
                                }
                            };
                        })
                    }
                }
            });
        });
        res.status(200).json({ message: "Pesanan Dibatalkan" });
    }
    catch (e) {
        next(e);
    }
};
export const finishOrder = async (req, res, next) => {
    try {
        const order = await prisma.order.update({
            where: {
                id: req.params.orderId
            },
            data: {
                orderToko: {
                    updateMany: {
                        where: {
                            orderId: req.params.orderId
                        },
                        data: {
                            statusPesanan: "SELESAI"
                        }
                    }
                }
            }
        });
        res.status(200).json({ message: "Pesanan Selesai" });
    }
    catch (e) {
        next(e);
    }
};
// Toko ambil semua orderan ke tokonya
export const getMerchantOrder = async (req, res, next) => {
    try {
        const tanggal_min = (req.query.tanggal_min ? new Date(req.query.tanggal_min) : undefined);
        const tanggal_max = (req.query.tanggal_max ? new Date(req.query.tanggal_max) : undefined);
        var where = {};
        var filter_order = {};
        const filter_pesanan = {
            PESANAN_DITERIMA: "PESANAN_DITERIMA",
            PESANAN_DIPROSES: "PESANAN_DIPROSES",
            PESANAN_DIKIRIM: "PESANAN_DIKIRIM",
            DIBATALKAN: "DIBATALKAN",
            SELESAI: "SELESAI",
        };
        if (req.query.urut === "perlu diproses") {
            filter_order["statusPembayaran"] = "PEMBAYARAN_DITERIMA";
            where['statusPesanan'] = filter_pesanan["PESANAN_DITERIMA"];
        }
        else if (req.query.urut === "sedang dikemas") {
            filter_order["statusPembayaran"] = "PEMBAYARAN_DITERIMA";
            where['statusPesanan'] = filter_pesanan["PESANAN_DIPROSES"];
        }
        else if (req.query.urut === "dalam pengiriman") {
            filter_order["statusPembayaran"] = "PEMBAYARAN_DITERIMA";
            where['statusPesanan'] = filter_pesanan["PESANAN_DIKIRIM"];
        }
        else if (req.query.urut === "pesanan selesai") {
            filter_order["statusPembayaran"] = "PEMBAYARAN_DITERIMA";
            where['statusPesanan'] = filter_pesanan["SELESAI"];
        }
        else if (req.query.urut === "pesanan dibatalkan") {
            where['statusPesanan'] = filter_pesanan["DIBATALKAN"];
        }
        filter_order["id"] = req.query.order_id;
        where['tokoId'] = req.user.id;
        where['order'] = filter_order;
        where['createdAt'] = {
            gte: tanggal_min,
            lte: tanggal_max
        };
        const orderan = await prisma.orderToko.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: where,
            select: {
                id: true,
                noResi: true,
                createdAt: true,
                statusPesanan: true,
                subTotal: true,
                ongkosKirim: true,
                order: {
                    select: {
                        statusPembayaran: true
                    }
                },
                itemOrder: {
                    select: {
                        kuantitas: true,
                        subTotal: true,
                        produk: {
                            select: {
                                id: true,
                                namaProduk: true,
                                gambar: true,
                                harga: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({ data: orderan });
    }
    catch (e) {
        next(e);
    }
};
export const getMyOrder = async (req, res, next) => {
    try {
        var where = {};
        if (req.query.urut === "belum dibayar") {
            where['statusPembayaran'] = "MENUNGGU_PEMBAYARAN";
        }
        else if (req.query.urut === "sudah dibayar") {
            where['statusPembayaran'] = "PEMBAYARAN_DITERIMA";
        }
        else if (req.query.urut === "pesanan selesai") {
            where['orderToko'] = {
                every: {
                    statusPesanan: "SELESAI"
                }
            };
        }
        else if (req.query.urut === "pesanan dibatalkan") {
            where['orderToko'] = {
                every: {
                    statusPesanan: "DIBATALKAN"
                }
            };
        }
        where['userId'] = req.user.id;
        const order = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: where,
            select: {
                id: true,
                total: true,
                statusPembayaran: true,
                metodePembayaran: true,
                orderToko: {
                    select: {
                        id: true,
                        toko: {
                            select: {
                                id: true,
                                namaLengkap: true,
                                noTelpon: true
                            }
                        },
                        subTotal: true,
                        statusPesanan: true,
                        itemOrder: {
                            select: {
                                kuantitas: true,
                                subTotal: true,
                                produk: {
                                    select: {
                                        id: true,
                                        namaProduk: true,
                                        gambar: true,
                                        harga: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({ data: order });
    }
    catch (e) {
        next(e);
    }
};
export const getMyOrderDetail = async (req, res, next) => {
    try {
        const detail_order = await prisma.order.findUnique({
            where: {
                id: req.params.orderId
            },
            select: {
                id: true,
                total: true,
                statusPembayaran: true,
                metodePembayaran: true,
                token: true,
                createdAt: true,
                user: {
                    select: {
                        namaLengkap: true,
                        noTelpon: true,
                        alamat: true
                    }
                },
                orderToko: {
                    select: {
                        toko: {
                            select: {
                                id: true,
                                namaLengkap: true,
                                noTelpon: true
                            }
                        },
                        noResi: true,
                        subTotal: true,
                        statusPesanan: true,
                        itemOrder: {
                            select: {
                                produk: {
                                    select: {
                                        id: true,
                                        namaProduk: true,
                                        harga: true,
                                        gambar: true,
                                    }
                                },
                                kuantitas: true,
                                subTotal: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({ data: detail_order });
    }
    catch (e) {
        next(e);
    }
};
export const updateOrder = async (req, res, next) => {
    try {
        const update_order = await prisma.orderToko.update({
            where: {
                id: req.params.orderTokoId
            },
            data: {
                noResi: req.body.no_resi,
                statusPesanan: req.body.status_pesanan
            }
        });
        res.status(200).json({ data: update_order });
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=order.js.map