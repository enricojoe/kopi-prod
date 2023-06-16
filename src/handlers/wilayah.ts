import prisma from "../db"

export const getProvinces = async (req, res, next) => {
	try {
		const provinsi = await prisma.provinsi.findMany()

		res.status(200).json({ data: provinsi })
	} catch (e) {
		next(e)
	}
}

export const getRegencies = async (req, res, next) => {
	try {
		const kabupaten = await prisma.kabupaten.findMany({
			where: {
				kodeProvinsi: req.query.provinsi
			}
		})

		res.status(200).json({ data: kabupaten })
	} catch (e) {
		next(e)
	}
}

export const getDistricts = async (req, res, next) => {
	try {
		const kecamatan = await prisma.kecamatan.findMany({
			where: {
				kodeKabupaten: req.query.kabupaten
			}
		})

		res.status(200).json({ data: kecamatan })
	} catch (e) {
		next(e)
	}
}

export const getVillages = async (req, res, next) => {
	try {
		const desa = await prisma.desa.findMany({
			where: {
				kodeKecamatan: req.query.kecamatan
			}
		})

		res.status(200).json({ data: desa })
	} catch (e) {
		next(e)
	}
}