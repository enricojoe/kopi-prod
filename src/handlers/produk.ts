import prisma from "../db"

// Hanya untuk toko dan koperasi
export const createProduct = async (req, res, next) => {
	try {
		const gambar_produk = req.files.map(element => element['path'])
		const id_kategori = req.body.kategori_id.map(id => { id })
		const produk = await prisma.produk.create({
			data: {
				namaProduk: req.body.nama_produk,
				deskripsi: req.body.deskripsi,
				sku: req.body.sku,
				harga: parseFloat(req.body.harga),
				stok: parseInt(req.body.stok),
				gambar: gambar_produk,
				userId: req.user.id,
				kategori_produk: {
					create: {
						kategori: {
							connect: id_kategori
						}
					}
				}
			}
		})
	
		res.json({ data: produk })
	} catch (e) {
		console.log(e)
		next(e)
	}
}

export const getAllProducts = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findMany()

		res.json({ data: produk })
	} catch (e) {
		next(e)
	}
}

export const getUserProducts = async (req, res, next) => {
	try {	
		const user = await prisma.user.findUnique({
			where: {
				id: req.user.id
			},
			include: {
				produk: true
			}
		})

		res.json({ data: user.produk })
	} catch (e) {
		next(e)
	}
}

export const getProductById = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findUnique({
			where: {
				id: req.params.produkId
			}
		})

		res.json({ data: produk })
	} catch (e) {
		next(e)
	}
}

export const updateProduct = async (req, res, next) => {
	try {
		const gambar_produk = req.files.map((element) => element['path'])
		const id_kategori = req.body.kategori_id.map(id => { id })
		const updated = await prisma.produk.update({
			where: {
				id: req.params.produkId
			},
			data: {
				namaProduk: req.body.nama_produk,
				deskripsi: req.body.deskripsi,
				sku: req.body.sku,
				harga: parseFloat(req.body.harga),
				stok: parseInt(req.body.stok),
				gambar: gambar_produk,
				kategori_produk: {
					create: {
						kategori: {
							connect: id_kategori
						}
					}
				}

			}
		})

		res.json({ data: updated })
	} catch (e) {
		next(e)
	}
}

export const deleteProduct = async (req, res, next) => {
	try {
		const deleted = await prisma.produk.delete({
			where: {
				id: req.params.produkId
			}
		})

		res.json({ data: deleted })
	} catch (e) {
		next(e)
	}
}