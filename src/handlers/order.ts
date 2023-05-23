import prisma from "../db"

// item order (per produk => produk, kuantitas pesanan)
// order (per toko dan disertai pengiriman => kumpulan item order, total/sub total, status, metode pengiriman)
// transaksi (dengan pembayaran => kumpulan order, total keseluruhan, metode pembayaran, status)

export const createOrder = async (req, res, next) => {
	try {
		const id_produk = req.body.id_produk_keranjang
		const toko_produk = await prisma.user.findMany({
			where: {
				produk: {
					some: {
						id: {
							in: id_produk
						}
					}
				}
			},
			select: {
				id: true, 
				produk: {
					where: {
						id: {
							in: id_produk
						},
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
						itemKeranjang: {
							where: {
								Keranjang: {
									userId: req.user.id
								}
							},
							select: {
								kuantitas: true,
								subTotal: true
							}
						}
					}
				}
			}
		})

		var total = 0
		const order_toko = toko_produk.map(toko => {
			var subTotalToko = 0
			var list_item = toko.produk.map(item => {
				subTotalToko += item.itemKeranjang[0].subTotal
				return {
					produkId: item.id,
					kuantitas: item.itemKeranjang[0].kuantitas,
					subTotal: item.itemKeranjang[0].subTotal
				}
			})
			total += subTotalToko
			return {
				tokoId: toko.id,
				subTotal: subTotalToko,
				itemOrder: {
					create: list_item
				}
			}
		})

		const order = await prisma.order.create({
			data: {
				userId: req.user.id,
				total: total,
				orderToko: {
					create: order_toko
				}
			},
			select: {
				id: true,
				userId: true,
				total: true,
				orderToko: {
					select: {
						tokoId: true,
						subTotal: true,
						itemOrder: {
							select: {
								produkId: true,
								kuantitas: true,
								subTotal: true
							}
						}
					}
				}
			}
		})

		res.json({ data : order })
	} catch (e) {
		next(e)
	}
}

export const getUserOrderDetail = async (req, res, next) => {
	try {
		const detail_order = await prisma.orderToko.findUnique({
			where: {
				id: req.params.orderTokoId
			},
			select: {
				order: {
					select: {
						user: {
							select: {
								id: true,
								namaLengkap: true,
								alamat: {
									select: {
										provinsi: true,
										kabupaten: true,
										kecamatan: true,
										detailAlamat: true,
										kodePos: true
									}
								}
							}
						},
					}
				},
				noResi: true,
				subTotal: true,
				statusPesanan: true,
				itemOrder: {
					select: {
						produk: {
							select: {
								id: true,
								namaProduk: true,
								harga: true,
								gambar: true
							}
						},
						kuantitas: true,
						subTotal: true
					}
				}
			}
		})

		res.status(200).json({ data: detail_order })
	} catch (e) {
		next(e)
	}
}

// Toko ambil semua orderan ke tokonya
export const getMerchantOrder = async (req, res, next) => {
	try {
		const orderan = await prisma.orderToko.findMany({
			where: {
				tokoId: req.user.id
			},
			select: {
				id: true,
				noResi: true,
				order: {
					select: {
						user: {
							select: {
								id: true,
								namaLengkap: true
							}
						}
					}
				},
				itemOrder: {
					select: {
						kuantitas: true,
						subTotal: true,
						produk: {
							select: {
								id: true,
								namaProduk: true,
								gambar: true,
								harga: true
							}
						}
					}
				}
			}
		})

		res.status(200).json({ data: orderan })
	} catch (e) {
		next(e)
	}
}

export const getMyOrder = async (req, res, next) => {
	try {
		const order = await prisma.order.findMany({
			where: {
				userId: req.user.id
			},
			select: {
				total: true,
				statusPembayaran: true,
				metodePembayaran: true,
				orderToko: {
					select: {
						toko: {
							select: {
								id: true,
								namaLengkap: true
							}
						},
						noResi: true,
						subTotal: true,
						statusPesanan: true,
						itemOrder: {
							select: {
								kuantitas: true,
								subTotal: true,
								produk: {
									select: {
										namaProduk: true,
										gambar: true,
										harga: true
									}
								}
							}
						}
					}
				}
			}
		})

		res.status(200).json({ data: order })
	} catch (e) {
		next(e)
	}
}

export const updateTrackingNumber = async (req, res, next) => {
	try {
		const update_order = await prisma.orderToko.update({
			where: {
				id: req.params.orderTokoId
			},
			data: {
				noResi: req.body.no_resi
			}
		})

		res.status(200).json(update_order)
	} catch (e) {
		next(e)
	}
}