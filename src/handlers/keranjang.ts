import prisma from "../db"

// Tambah orderan
// Request:
// - produkId: req.body.produk_id
// - kuantitas: req.body.kuantitas
// Response:
// - Data yang diorder
export const createOrder = async (req, res, next) => {
	try {
		const keranjang = await prisma.keranjang.findUnique({
			where: {
				userId: req.user.id
			}
		})
		const produk = await prisma.produk.findUnique({
			where: {
				id: req.params.produkId
			}
		})
		const order = await prisma.order.upsert({
			where: {
				produkId_keranjangId:{
					produkId: produk.id,
					keranjangId: keranjang.id
				}
			},
			create: {
				keranjangId: keranjang.id,
				produkId: req.body.produk_id,
				kuantitas: req.body.kuantitas,
				subTotal: produk.harga * req.body.kuantitas
			},
			update: {
				kuantitas: req.body.kuantitas,
				subTotal: produk.harga * req.body.kuantitas
			}
		})

		res.json({ data: order })
	} catch (e) {
		next(e)
	}
}

export const deleteOrder = async (req, res, next) => {
	try {
		const keranjang = await prisma.keranjang.findUnique({
			where: {
				userId: req.user.id
			}
		})
		const deleted = await prisma.order.delete({
			where: {
				produkId_keranjangId:{
					produkId: req.params.produkId,
					keranjangId: keranjang.id
				}
			}
		})

		res.json({ data: deleted })
	} catch (e) {
		next(e)
	}
}

export const getUserCart = async (req, res) => {
	const keranjang = await prisma.keranjang.findUnique({
		where: {
			userId: req.user.id
		},
		include: {
			order: true
		}
	})

	res.json({ data: keranjang })
}

export const updateCart = async (req, res) => {
	const keranjang = await prisma.keranjang.update({
		where: {
			userId: req.user.id
		},
		data: {
			total: req.body.total
		}
	})

	res.json({ data: keranjang })
}
