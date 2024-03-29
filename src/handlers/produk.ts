import prisma from "../db"
import { uploadImage } from "../config"
import redis from "../modules/redis"

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
		// hapus json parse
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
				tinggi: parseFloat(req.body.tinggi),
				berat: parseFloat(req.body.berat),
				lebar: parseFloat(req.body.lebar),
				panjang: parseFloat(req.body.panjang),
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

// Mengambil semua produk yang tersedia
// Request: NONE
// Response: 
// - Data semua produk yang tersedia
export const getAllProducts = async (req, res, next) => {
	try {
		const produk = await prisma.produk.findMany({
			select: {
				id: true,
				user: {
					select: {
						id: true,
						namaLengkap: true,
					},
				},
				namaProduk: true,
				gambar: true,
				harga: true,
				kategori_produk: {
					select: {
						kategori: {
							select: {
								id: true,
								kategori: true,
								deskripsi: true,
								gambar: true
							}
						}
					}
				}
			}
		})

		const terlaris = await prisma.produk.findMany({
			take: 6,
			select: {
				id: true,
				user: {
					select: {
						id: true,
						namaLengkap: true
					}
				},
				namaProduk: true,
				gambar: true,
				harga: true,
				terjual: true
			},
			orderBy: {
				terjual: 'desc'
			}
		})

		redis.caching(req.originalUrl, { produk, terlaris })
		redis.setExpire(req.originalUrl)
		res.status(200).json({ data: {produk, terlaris} })
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
		const user = await prisma.user.update({
			where: {
				id: req.params.tokoId
			},
			data: {
				pengunjung: {
					increment: 1
				}
			},
			select: {
				id: true,
				namaLengkap: true,
				createdAt: true,
				deskripsi: true,
				pengunjung: true,
				gambar: true,
				noTelpon: true,
				_count: {
					select: {
						produk: true
					}
				},
				alamat: true,
				produk: {
					select: {
						id: true,
						namaProduk: true,
						gambar: true,
						harga: true,
						terjual: true
					}
				}
			}
		})
		redis.caching(req.originalUrl, user)
		redis.setExpire(req.originalUrl)
		res.status(200).json({ data: user })
	} catch (e) {
		next(e)
	}
}

// Mengamzbil data produk berdasarkan id produk
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
						noTelpon: true,
						produk: {
							take: 3,
							select: {
								id: true,
								namaProduk: true,
								gambar: true,
								harga: true
							},
							where: {
								NOT: {
									id: req.params.produkId
								}
							}
						}
					},
				},
				kategori_produk: {
					select: {
						kategori: true
					}
				}
			}
		})
		redis.caching(req.originalUrl, produk)
		redis.setExpire(req.originalUrl)
		res.status(200).json({ data: produk })
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
		// gambar
		var image = undefined
		if ( req.body.gambar_produk !== undefined ){
			console.log(req.body.gambar_produk)
			image = await uploadImage(req.body.gambar_produk, "produk")
		}

		const hapus_kategori = await prisma.produkKategori.deleteMany({
			where: {
				produkId: req.params.produkId
			}
		})

		// kategori
		var kategori = []
		if ( req.body.kategori_id !== undefined ){
			const coba_json = JSON.parse(req.body.kategori_id)
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
		}
	
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
				gambar: image,
				tinggi: parseFloat(req.body.tinggi),
				berat: parseFloat(req.body.berat),
				lebar: parseFloat(req.body.lebar),
				panjang: parseFloat(req.body.panjang),
				kategori_produk: {
					create: kategori
				}
			}, 
			include: {
				kategori_produk: {
					select: {
						kategori: true
					}
				}
			}
		})

		redis.delCache(`/produk/ambil/${updated.id}`)
		res.status(200).json({ data: updated })
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
			},
			select: {
				id: true
			}
		})

		redis.delCache(`/produk/ambil/${deleted.id}`)
		res.status(200).json({ data: deleted })
	} catch (e) {
		next(e)
	}
}

export const searchProduct = async (req, res, next) => {
	try {

		var urut = {}

		if (req.query.urut === "terbaru") {
			urut["createdAt"] = "desc"
		} else if (req.query.urut === "terlaris") {
			urut["terjual"] = "desc"
		} else if (req.query.urut === "termahal") {
			urut["harga"] = "desc"
		} else if (req.query.urut === "termurah") {
			urut["harga"] = "asc"
		}

		const cari = await prisma.produk.findMany({
			orderBy: urut,
			where: {
				namaProduk: {
					search: req.query.cari
				}
			},
			select: {
				user: {
					select: {
						id: true,
						namaLengkap: true,
					},
				},
				id: true,
				namaProduk: true,
				gambar: true,
				harga: true,
				kategori_produk: {
					select: {
						kategori: {
							select: {
								id: true,
								kategori: true,
								deskripsi: true,
								gambar: true
							}
						}
					}
				}
			}
		})

		redis.caching(req.originalUrl, cari)
		redis.setExpire(req.originalUrl)
		res.status(200).json({ data: cari })
	} catch (e) {
		next(e)
	}
}