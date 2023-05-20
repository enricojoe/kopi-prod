import prisma from "../db"

// Tambah/edit item keranjang
// Request:
// - produkId: req.params.produkId
// - kuantitas: req.body.kuantitas
// Response:
// - Data item yang ditambahkan/diedit
export const createCartItem = async (req, res, next) => {
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
		const item = await prisma.itemKeranjang.upsert({
			where: {
				produkId_keranjangId:{
					produkId: produk.id,
					keranjangId: keranjang.id
				}
			},
			update: {
				kuantitas: parseInt(req.body.kuantitas),
				subTotal: produk.harga * parseInt(req.body.kuantitas)
			},
			create: {
				keranjangId: keranjang.id,
				produkId: produk.id,
				kuantitas: parseInt(req.body.kuantitas),
				subTotal: produk.harga * parseInt(req.body.kuantitas)
			}
		})

		res.status(200).json({ data: item })
	} catch (e) {
		next(e)
	}
}

// Ambil data item keranjang
// Request: None
// Response: 
// - Data item keranjang
export const getCartItem = async (req, res, next) => {
	try {
		const keranjang = await prisma.keranjang.findUnique({
			where: {
				userId: req.user.id
			}
		})

		const item = await prisma.itemKeranjang.findUnique({
			where: {
				produkId_keranjangId: {
					produkId: req.params.produkId,
					keranjangId: keranjang.id
				}
			}
		})
	} catch (e) {
		next(e)
	}
}

// Hapus item keranjang
// Request:
// - produkId: req.params.produkId
// Response:
// - Data item yang dihapus
export const deleteCartItem = async (req, res, next) => {
	try {
		const keranjang = await prisma.keranjang.findUnique({
			where: {
				userId: req.user.id
			}
		})
		const deleted = await prisma.itemKeranjang.delete({
			where: {
				produkId_keranjangId: {
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

// Ambil data keranjang user
// Request: None
// Response: 
// - Data keranjang beserta item di dalamnya
export const getUserCart = async (req, res, next) => {
	try {
		const keranjang = await prisma.user.findMany({
			where: {
				produk: {
					some: {
						itemKeranjang: {
							some: {
								Keranjang: {
									userId: req.user.id
								}
							}
						}
					}
				}
			},
			select: {
				id: true,
				namaLengkap: true,
				produk: {
					where: {
						itemKeranjang: {
							some: {
								Keranjang: {
									userId: req.user.id
								}
							}
						}
					},
					select: {
						id: true,
						namaProduk: true,
						gambar: true, 
						harga: true,
						itemKeranjang: {
							where: {
								Keranjang: {
									userId: req.user.id
								}
							},
							select: {
								kuantitas: true
							}
						}
					}
				}
			}
		})

		res.json({ data: keranjang })
	} catch (e) {
		next(e)
	}
}

// Update data keranjang
// Request: 
// - total: req.body.total
// Response:
// - Data keranjang dengan total baru
export const updateCart = async (req, res, next) => {
	try {
		const keranjang = await prisma.keranjang.update({
			where: {
				userId: req.user.id
			},
			data: {
				total: parseFloat(req.body.total)
			}
		})

		res.json({ data: keranjang })
	} catch (e) {
		next(e)
	}
}
