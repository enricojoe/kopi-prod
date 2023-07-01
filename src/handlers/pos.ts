import prisma from "../db"
import pos from "../modules/pos"

export const getPosFee = async (req, res, next) => {
	try {
		// toko_produk = [
		// 	id: "id_toko",
		// 	kodePos: "kode_pos",
		// 	produk: {
		// 		itemKeranjang: [
		// 			totalBerat: 10000,
		// 			subTotal: 2000
		// 		]
		// 	}
		// ]
		const toko_produk = req.body.toko_produk
		var ongkir = []
		var tes = ""
		console.log(toko_produk)
		
		await toko_produk.forEach(async toko => {
			var total_berat = 0
			var total_harga = 0
			toko.produk.forEach(produk => {
				total_berat = total_berat + produk.itemKeranjang[0].totalBerat
				total_harga = total_harga + produk.itemKeranjang[0].subTotal
			})
			var detail_barang = {
				kode_pos_pengirim: toko.kodePos,
				kode_pos_penerima: req.body.kode_pos_penerima,
				berat: total_berat,
				harga: total_harga
			}
			var fee = await pos.getFee(detail_barang)
			ongkir.push({
				id_toko: toko.id,
				ongkir: fee.rs_fee.r_fee
			})
			tes = "Ini kalimatnya diganti"
			console.log(tes)
		})
		console.log("=============")
		console.log(tes)
		console.log(ongkir)
		console.log("=============")
		res.status(200).json({ data: ongkir })
	} catch (e) {
		next(e)
	}
}

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
						totalBerat: true
					}
				}
			}
		})
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
	    }

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
		}
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
		}

		var detail_pembayaran = [ 
			{ name: 'fee', value: 70000 }, 
			{ name: 'insurance', value: 700 } 
		]
		var pajak = [ 
			{ name: 'fee', value: 700 }, 
			{ name: 'insurance', value: 700 } 
		]
		var layanan = [
			{ name: 'genreceipt', value: 1 },
			{ name: 'printreceipt', value: 1 },
			{ name: 'pickup', value: 0 },
			{ name: 'delivery', value: 1 },
			{ name: 'packing', value: 1 }
		]
		var order_toko_id = order.orderToko[0].id
		var result = await pos.addPostingDoc({order_toko_id,
											alamat_pengirim, 
											alamat_penerima, 
											detail_item,
											detail_pembayaran,
											pajak,
											layanan})

		res.status(200).json({ message: "Permintaan pickup dikirim", data: result })
	} catch (e) {
		next(e)
	}
}


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