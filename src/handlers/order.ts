import prisma from "../db"

// item order (per produk => produk, kuantitas pesanan)
// order (per toko dan disertai pengiriman => kumpulan item order, total/sub total, status, metode pengiriman)
// transaksi (dengan pembayaran => kumpulan order, total keseluruhan, metode pembayaran, status)

// export const createOrder = async (req, res, next) => {
// 	try {
// 		const item_keranjang_json = req.body.item_keranjang
// 		var item_order = []
// 		var total = 0
// 		item_keranjang_json.forEach(item => {
			// let contoh_item_order = {
			// 	kuantitas: item.kuantitas,
			// 	subTotal: item.subTotal,
			// 	produkId: item.produkId
			// }
// 			item_order.push(contoh_item_order)
// 			total += item.subTotal
// 		})

// 		const order = await prisma.order.create({
// 			data: {
// 				userId: req.user.id,
// 				total: total,
// 				itemOrder: {
// 					create: item_order
// 				}
// 			}, 
// 			include: {
// 				itemOrder: true
// 			}
// 		})
// 		res.status(200).json({ data: order })
// 	} catch (e) {
// 		next(e)
// 	}
// }

export const createOrder = async (req, res, next) => {
	try {
		const item_keranjang = JSON.parse(req.body.id_produk_keranjang)
		var item_order = []
		var total = 0

		const order_item_keranjang = await prisma.itemKeranjang.findMany({
			where: {
				Keranjang: {
					userId: req.user.id
				},
				produkId: {
					in: item_keranjang
				}
			}
		})

		order_item_keranjang.forEach(item => {
			let contoh_item_order = {
				kuantitas: item.kuantitas,
				subTotal: item.subTotal,
				produkId: item.produkId
			}
			item_order.push(contoh_item_order)
			total += item.subTotal
		})

		const order = await prisma.order.create({
			data: {
				userId: req.user.id,
				total: total,
				itemOrder: {
					create: item_order
				}
			}, 
			include: {
				itemOrder: true
			}
		})

		res.status(200).json({ data: order })

	} catch (e) {
		next(e)
	}
}

export const getUserOrder = async (req, res, next) => {
	try {
		const order = await prisma.user.findUnique({
			where: {
				id: req.user.id
			},
			select: {
				Order: true
			}
		})

		res.status(200).json({ data: order })
	} catch (e) {
		next(e)
	}
}

export const getPeopleOrder = async (req, res, next) => {
	try {
		const orderan = await prisma.user.findUnique({
			where: {
				id: req.user.id
			},
			select: {
				produk: {
					include: {
						ItemOrder: true
					}
				}
			}
		})

		res.status(200).json({ data: orderan })
	} catch (e) {
		next(e)
	}
}

// export const instantBuy = async (req, res, next) => {
// 	try {
// 		const produk = await prisma.produk.findUnique({
// 			where: {
// 				id: req.params.produkId
// 			}
// 		})
// 		const order = await prisma.order.create({
// 			data: {
// 				userId: req.user.id,
// 				total: parseInt(req.body.kuantitas) * produk.harga,
// 				itemOrder: {
// 					create: {
// 						produkId: produk.id,
// 						kuantitas: parseInt(req.body.kuantitas)
// 					}
// 				}
// 			}
// 		})

// 		res.json({ data: order })
// 	} catch (e) {
// 		next(e)
// 	}
// }

export const dummyPay = async (req, res, next) => {
	try {
		const order = await prisma.order.findUnique({
			where: {
				id: req.params.orderId
			}
		})

		if (order.status !== "MENUNGGU_PEMBAYARAN"){
			throw new Error("Pesanan sudah dibayarkan")
		}
		const bayar = await prisma.order.update({
			where: {
				id: order.id
			},
			data: {
				status: "PESANAN_DIPROSES"
			},
			include: {
				itemOrder: true
			}
		})

		const produk = await prisma.produk.findUnique({
			where: {
				id: bayar.itemOrder[0].produkId
			}
		})

		const updateProduk = await prisma.produk.update({
			where: {
				id: produk.id
			},
			data: {
				stok: produk.stok - bayar.itemOrder[0].kuantitas
			}
		})
		res.json({ data: bayar })
	} catch (e) {
		next(e)
	}
}

// export const createItemOrder = async (req, res, next) => {
// 	try {
// 		const produk = await prisma.produk.findUnique({
// 			where: {
// 				id: req.params.produkId
// 			}
// 		})
// 		const item = await prisma.order.create({
// 			data: {

// 			}
// 		})
// 	} catch (e) {
// 		next(e)
// 	}
// }

// export const createOrder = async (req, res, next) => {
// 	try {

// 		const order = await prisma.order.create({
// 			data: {
// 				userId: 
// 			}
// 		})
// 	} catch (e) {

// 	}
// }