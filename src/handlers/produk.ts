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
		// kategori
		const kategori_json = JSON.parse(req.body.kategori_id)
		var kategori = []
		kategori_json.forEach(id_kategori => {
			let contoh_kategori = {
				kategori:{
					connect:{
						id:id_kategori
					}
				}
			}
			kategori.push(contoh_kategori)
		})

		const image = await uploadImage(req.body.gambar_produk, "produk")

		const produk = await prisma.produk.create({
			data: {
				namaProduk: req.body.nama_produk,
				deskripsi: req.body.deskripsi,
				sku: req.body.sku,
				harga: parseFloat(req.body.harga),
				stok: parseInt(req.body.stok),
				gambar: image,
				userId: req.user.id,
				kategori_produk: {
					create: kategori
				},
				terjual: 0 //default
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

// Mengambil semua produk yang tersedia
// Request: NONE
// Response: 
// - Data semua produk yang tersedia
export const getAllProducts = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findMany({
			include: {
				user: {
					select: {
						namaLengkap: true,
					},
				},
				kategori_produk: {
					select: {
						kategori: true
					}
				}
			}
		})
		res.json({ data: produk })
	} catch (e) {
		next(e)
	}
}

// Mengambil produk berdasarkan id user (toko/koperasi)
// Request:
// - id (user id): req.params.userId
// Response:
// - Data user beserta produknya
export const getUserProducts = async (req, res, next) => {
	try {
		console.log(req.params.tokoId)
		const user = await prisma.user.findUnique({
			where: {
				id: req.params.tokoId
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
						alamat: true,
						gambar:true,
					},
				},
				kategori_produk: {
					select: {
						kategori: true
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

		// const id_kategori = req.body.kategori_id.map(id => { id })

		// DONT UPDATE IMAGE IF THERE IS NO IMAGE
		var data = {}
		if(req.body.gambar == "undefined"){
			data = {
				namaProduk: req.body.nama_produk,
				deskripsi: req.body.deskripsi,
				sku: req.body.sku,
				harga: parseFloat(req.body.harga),
				stok: parseInt(req.body.stok),
				kategori_produk: {
					create: kategori
				}
			} 
		} else {
			const image = await uploadImage(req.body.gambar_produk, "produk")
			data = {
			   namaProduk: req.body.nama_produk,
			   deskripsi: req.body.deskripsi,
			   sku: req.body.sku,
			   harga: parseFloat(req.body.harga),
			   stok: parseInt(req.body.stok),
			   gambar: image,
			   kategori_produk: {
				   create: kategori
			   }
		   }
		}
	
		const updated = await prisma.produk.update({
			where: {
				id: req.params.produkId
			},
			data: data
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