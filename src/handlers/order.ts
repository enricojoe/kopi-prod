import prisma from "../db"

// item order (per produk => produk, kuantitas pesanan)
// order (per toko dan disertai pengiriman => kumpulan item order, total/sub total, status, metode pengiriman)
// transaksi (dengan pembayaran => kumpulan order, total keseluruhan, metode pembayaran, status)

export const instantBuy = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findUnique({
			where: {
				id: req.params.produkId
			}
		})
		const order = await prisma.order.create({
			data: {
				userId: req.user.id,
				total: parseInt(req.body.kuantitas) * produk.harga,
				itemOrder: {
					create: {
						produkId: produk.id,
						kuantitas: parseInt(req.body.kuantitas)
					}
				}
			}
		})

		res.json({ data: order })
	} catch (e) {
		next(e)
	}
}

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