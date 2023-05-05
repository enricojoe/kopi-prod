import prisma from "../db"

export const createCategory = async (req, res, next) => {
	try {
		const kategori = await prisma.kategori.create({
			data: {
				kategori: req.body.kategori,
				deskripsi: req.body.deskripsi,
				gambar: req.file.path
			}
		})

		res.json({ data: kategori })
	} catch (e) {
		next(e)
	}
}

export const getAllCategory = async (req, res, next) => {
	try {
		const kategori = await prisma.kategori.findMany()

		res.json({ data: kategori })
	} catch (e) {
		next(e)
	}
}

export const updateCategory = async (req, res, next) => {
	try {
		if (req.file) {
			const updated = await prisma.kategori.update({
				where: {
					id: req.params.kategoriId
				},
				data: {
					kategori: req.body.kategori,
					deskripsi: req.body.deskripsi,
					gambar: req.file.path
				}
			})
			res.json({ data: updated })
		} else {
			const updated = await prisma.kategori.update({
				where: {
					id: req.params.kategoriId
				},
				data: {
					kategori: req.body.kategori,
					deskripsi: req.body.deskripsi
				}
			})
			res.json({ data: updated })
		}

	} catch (e) {
		next(e)
	}
}

export const deleteCategory = async (req, res, next) => {
	try {
		const deleted = await prisma.kategori.delete({
			where: {
				id: req.params.kategoriId
			}
		})

		res.json({ data: deleted })
	} catch (e) {
		next(e)
	}
}