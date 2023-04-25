import prisma from "../db"

export const createProduct = async (req, res, next) => {
	try {
		const produk = await prisma.produk.create({
			data: {
				namaProduk: req.body.nama_produk,
				deskripsi: req.body.deskripsi,
				sku: req.body.sku,
				harga: req.body.harga,
				kategori: req.body.kategori,
				stok: req.body.stok,
				userId: req.user.id
			}
		})
	
		res.json({ data: produk })
	} catch (e) {
		console.log(e)
		next(e)
	}
}

export const getAllProducts = async (req, res) => {
	const produk = await prisma.produk.findMany()

	res.json({ data: produk })
}

export const getUserProducts = async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		include: {
			produk: true
		}
	})

	res.json({ data: user.produk })
}

export const getProductById = async (req, res) => {
	const produk = await prisma.produk.findUnique({
		where: {
			id_userId: {		
				id: req.params.produkId,
				userId: req.user.id
			}
		}
	})

	res.json({ data: produk })
}

export const updateProduct = async (req, res) => {
	const updated = await prisma.produk.update({
		where: {
			id_userId: {		
				id: req.params.produkId,
				userId: req.user.id
			}
		},
		data: {
			namaProduk: req.body.nama_produk,
			deskripsi: req.body.deskripsi,
			sku: req.body.sku,
			harga: req.body.harga,
			kategori: req.body.kategori,
			stok: req.body.stok
		}
	})

	res.json({ data: updated })
}

export const deleteProduct = async (req, res) => {
	const deleted = await prisma.produk.delete({
		where: {
			id_userId: {
				id: req.params.produkId,
				userId: req.user.id
			}
		}
	})

	res.json({ data: deleted })
}