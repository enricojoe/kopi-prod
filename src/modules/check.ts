import prisma from "../db"

// export const checkAdmin = (req, res, next) => {
// 	if (req.user.role[0] === "A001") {
// 		next(e)
// 	}
// }

export const checkToko = (req, res, next) => {
	if (req.user.role.includes("R102")) {
		next()
	} else {
		res.status(401).json({ message: "Tidak authorized" })
		return
	}
}

export const checkAlamat = async (req, res, next) => {
	try {
		const alamat = await prisma.alamat.findUnique({
			where: {
				userId: req.user.id
			}
		})

		if ((alamat.provinsi === "") || (alamat.kabupaten === null) || (alamat.detailAlamat === null)){
			res.status(428).json({ message: "Isi alamat terlebih dahulu" })
		} else {
			next()
		}
	} catch (e) {
		next(e)
	}
}
// console.log(JSON.stringify(produk, null, 2))
// export const checkStok = async (req, res, next) => {
// 	try {
// 		const id_produk = req.body.id_produk_keranjang
// 		const produk = await prisma.produk.findMany({
// 			where: {
// 				id: {
// 					in: id_produk
// 				}
// 			},
// 			select: {
// 				id: true,
// 				stok: true,
// 				itemKeranjang: {
// 					where: {
// 						Keranjang: {
// 							userId: req.user.id
// 						}
// 					},
// 					select: {
// 						kuantitas: true
// 					}
// 				}
// 			}
// 		})
// 		produk.forEach(item => {
// 			if ( item.stok - item.itemKeranjang[0].kuantitas < 0 ) {
// 				console.log("Tidak bisa brooo")
// 			} else {
// 				console.log("Bisa")
// 			}
// 		})

// 		next()
// 	} catch (e) {
// 		next(e)
// 	}
// }
