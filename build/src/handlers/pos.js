import prisma from "../db.js";
import pos from "../modules/pos.js";
export const getPosFee = async (req, res, next) => {
    try {
        if (req.body.kode_pos_penerima === undefined) {
            res.status(200).json({ message: "data_kosong" });
        }
        const toko_produk = req.body.toko_produk;
        var ongkir = [];
        for (let i = 0; i < toko_produk.length; i++) {
            var detail_barang = {
                kode_pos_pengirim: toko_produk[i].kodePos,
                kode_pos_penerima: req.body.kode_pos_penerima,
                berat: toko_produk[i].total_berat,
                harga: toko_produk[i].total_harga
            };
            var fee = await pos.getFee(detail_barang);
            ongkir.push({
                id: toko_produk[i].id,
                ongkir: fee.rs_fee.r_fee
            });
            if (toko_produk[i].kodePos.substring(0, 2) ===
                req.body.kode_pos_penerima.substring(0, 2)) {
                ongkir[i].ongkir.push({
                    "serviceCode": "AMBIL",
                    "serviceName": "AMBIL SENDIRI",
                    "fee": 0,
                    "feeTax": 0,
                    "insurance": 0,
                    "insuranceTax": 0,
                    "totalFee": 0,
                    "itemValue": toko_produk[i].total_harga,
                    "notes": ""
                });
            }
        }
        res.status(200).json({ data: ongkir });
    }
    catch (e) {
        next(e);
    }
};
export const addPostingDoc = async (req, res, next) => {
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: req.body.order_id
            },
            select: {
                user: {
                    select: {
                        namaLengkap: true,
                        noTelpon: true,
                        alamat: true
                    }
                },
                orderToko: {
                    where: {
                        tokoId: req.user.id
                    },
                    select: {
                        id: true,
                        toko: {
                            select: {
                                namaLengkap: true,
                                noTelpon: true,
                                alamat: true
                            }
                        },
                        subTotal: true,
                        totalBerat: true,
                        layananPengiriman: true
                    }
                }
            }
        });
        var pesan = "";
        var result;
        if (order.orderToko[0].layananPengiriman.serviceCode !== "AMBIL") {
            const alamat_penerima = {
                addresstype: 'receiverlocation',
                customertype: 1,
                name: order.user.namaLengkap,
                phone: order.user.noTelpon,
                email: '',
                address: order.user.alamat.detailAlamat,
                subdistrict: order.user.alamat.kecamatan,
                city: order.user.alamat.kabupaten,
                province: order.user.alamat.provinsi,
                zipcode: order.user.alamat.kodePos,
                country: 'Indonesia',
                geolang: '',
                geolat: '',
                description: ''
            };
            const alamat_pengirim = {
                addresstype: 'senderlocation',
                customertype: 1,
                name: order.orderToko[0].toko.namaLengkap,
                phone: order.orderToko[0].toko.noTelpon,
                email: '',
                address: order.orderToko[0].toko.alamat.detailAlamat,
                subdistrict: order.orderToko[0].toko.alamat.kecamatan,
                city: order.orderToko[0].toko.alamat.kabupaten,
                province: order.orderToko[0].toko.alamat.provinsi,
                zipcode: order.orderToko[0].toko.alamat.kodePos,
                country: 'Indonesia',
                geolang: '',
                geolat: '',
                description: ''
            };
            var detail_item = {
                itemtypeid: 1,
                productid: '240',
                valuegoods: order.orderToko[0].subTotal,
                weight: order.orderToko[0].totalBerat,
                length: req.body.panjang ? req.body.panjang : 0,
                width: req.body.lebar ? req.body.lebar : 0,
                height: req.body.tinggi ? req.body.tinggi : 0,
                codvalue: 0,
                pin: 0,
                itemdesc: req.body.deskripsi_pesanan
            };
            var detail_pembayaran = [
                { name: 'fee', value: order.orderToko[0].layananPengiriman.fee },
                { name: 'insurance', value: order.orderToko[0].layananPengiriman.insurance }
            ];
            var pajak = [
                { name: 'fee', value: order.orderToko[0].layananPengiriman.feeTax },
                { name: 'insurance', value: order.orderToko[0].layananPengiriman.insuranceTax }
            ];
            var layanan = [
                { name: 'genreceipt', value: 1 },
                { name: 'printreceipt', value: 1 },
                { name: 'pickup', value: 0 },
                { name: 'delivery', value: 1 },
                { name: 'packing', value: 1 }
            ];
            var order_toko_id = order.orderToko[0].id;
            var result = await pos.addPostingDoc({ order_toko_id,
                alamat_pengirim,
                alamat_penerima,
                detail_item,
                detail_pembayaran,
                pajak,
                layanan });
            if (result.respmsg === "Success posting") {
                pesan = "Permintaan pickup dikirim, menunggu POS menjemput";
                console.log(result.transref);
            }
            else if (result.respmsg === "DUPLICATE ORDER ID") {
                pesan = "Permintaan sudah dikirim, menunggu POS menjemput";
            }
            else {
                pesan = "Terjadi kesalahan, coba lagi";
            }
        }
        else {
            pesan = "Menunggu pembeli menjemput pesanan";
        }
        await prisma.orderToko.update({
            where: {
                id: order.orderToko[0].id
            },
            data: {
                noResi: result.transref,
                statusPesanan: "PESANAN_DIKIRIM"
            }
        });
        res.status(200).json({ message: pesan, data: result });
    }
    catch (e) {
        next(e);
    }
};
// const produk_keranjang = [
// 			{
// 				id_toko: "ini id toko",
// 				produk ['idproduk1', 'idproduk2']
// 			},
// 			{
// 				id_toko: "ini id toko",
// 				produk ['idproduk1', 'idproduk2']
// 			},
// 		]
// 		var ongkir = []
// 		produk_keranjang.forEach(item => {
// 			var detail_barang = {
// 				kode_pos_pengirim: toko.kodePos,
// 				kode_pos_penerima: req.body.kode_pos_penerima,
// 				berat: total_berat,
// 				harga: total_harga
// 			}
// 		})
//# sourceMappingURL=pos.js.map