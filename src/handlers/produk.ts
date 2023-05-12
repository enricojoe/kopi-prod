import prisma from "../db"
import { uploadImage } from "../config"

// ==Hanya untuk toko dan koperasi==
// Untuk menambah produk
// Request: 
// - namaProduk: req.body.nama_produk
// - deskripsi: req.body.deskripsi
// - sku: req.body.sku
// - harga: req.body.harga
// - stok: req.body.stok
// - gambar: req.files (form name = gambar_produk)
// - userId: req.user.id
// - kategori_produk: req.body.kategori_id (list of category id)
// Response:
// - Data product with category
export const createProduct = async (req, res, next) => {
	try {
		// upload gambar
		var link_gambar = []
		await Promise.all(req.files.map(async file => {
			const image = await uploadImage(file, "produk")
			link_gambar.push(image)
		}))

		// kategori
		const coba_json = JSON.parse(req.body.kategori_id)
		var kategori = []
		coba_json.forEach(id_kategori => {
			let contoh_kategori = {
				kategori:{
					connect:{
						id:id_kategori
					}
				}
			}
			kategori.push(contoh_kategori)
		})

		const produk = await prisma.produk.create({
			data: {
				namaProduk: req.body.nama_produk,
				deskripsi: req.body.deskripsi,
				sku: req.body.sku,
				harga: parseFloat(req.body.harga),
				stok: parseInt(req.body.stok),
				gambar: link_gambar,
				userId: req.user.id,
				kategori_produk: {
					create: kategori
				}
			},
			include: {
				kategori_produk: true
			}
		})
	
		res.json({ data: produk })
	} catch (e) {
		next(e)
	}
}

// Mengambil semua data produk
// Request: None
// Response:
// - Data semua produk
export const getAllProducts = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findMany({
			include: {
				user: {
					select: {
					  namaLengkap: true,
					},
				},
			}
		})
		res.json({ data: produk })
	} catch (e) {
		next(e)
	}
}

// Mengambil produk berdasarkan id user
// Request:
// - id: req.user.id
// Response:
// - Data produk milik user
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

// Mengambil data produk berdasarkan id produk
// Request:
// - id: req.user.id
// - produk: req.params.produkId
// Response:
// - data produk
// - alamat toko
export const getProductById = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findUnique({
			where: {
				id: req.params.produkId,
			},
			include: {
				user: {
					select: {
					  namaLengkap: true,
					  alamat: true
					}
				}
			}
		})
		res.json({ data: produk })
	} catch (e) {
		next(e)
	}
}

// Update data produk berdasarkan id produk
// Request:
// - id: req.params.produkId
// - namaProduk: req.body.nama_produk
// - sku: req.body.sku
// - harga: req.body.harga
// - stok: req.body.stok
// - gambar: req.files (form name "gambar_produk")
// - kategori_produk: req.body.kategori_id (list of category id)
// Response:
// - Data produk yang dihapus
export const updateProduct = async (req, res, next) => {
	try {
		// upload gambar
		var link_gambar = []
		await Promise.all(req.files.map(async file => {
			const image = await uploadImage(file, "produk")
			link_gambar.push(image)
		}))

		// kategori
		const coba_json = JSON.parse(req.body.kategori_id)
		var kategori = []
		coba_json.forEach(id_kategori => {
			let contoh_kategori = {
				kategori:{
					connect:{
						id:id_kategori
					}
				}
			}
			kategori.push(contoh_kategori)
		})

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
				gambar: link_gambar,
				kategori_produk: {
					create: kategori
				}

			}
		})

		res.json({ data: updated })
	} catch (e) {
		next(e)
	}
}

// Menghapus produk
// Request:
// - id: req.params.produkId
// Response:
// - Data produk yang dihapus
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