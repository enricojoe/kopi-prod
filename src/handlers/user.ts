import prisma from '../db'
import { hashPassword, comparePassword, createJWT } from "../modules/auth"

export const createNewUser = async (req, res, next) => {
	try {
		const user = await prisma.user.create({
			data: {
				username: req.body.username,
				password: await hashPassword(req.body.password),
				namaLengkap: req.body.nama_lengkap
			}
		})
		const token = createJWT(user)
		res.json({ token })
	} catch (e) {
		e.type = 'input'
		next(e)
	}
}

export const signin = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.body.username
			}
		})
		
		const isValid = await comparePassword(req.body.password, user.password)
		if (!isValid) {
			res.status(401)
			res.json({message: "Password Salah"})
			return
		}

		const token = createJWT(user)
		res.json({ token })
	} catch (e) {
		e.type = 'not_found'
		next(e)
	}
}

export const profile = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.user.username
			}
		})

		res.json(user)
	} catch (e) {
		next(e)
	}
}

export const updateProfile = async (req, res, next) => {
	try {
		const updateUser = await prisma.user.update({
			where: {
				username: req.user.username
			},
			data: {
				username: req.body.username,
				namaLengkap: req.body.nama_lengkap,
				noKoperasi: req.body.no_koperasi
			},
			include: {
				Alamat: true
			}
		})
		res.json(updateUser)
	} catch (e) {
		next(e)
	}
}

export const updateAlamat = async (req, res, next) => {
	try {
		const createAlamat = await prisma.alamat.upsert({
			where: {
				userId: req.user.id
			},
			create: {
				provinsi: req.body.provinsi,
				kabupaten: req.body.kabupaten,
				// kecamatan: req.body.kecamatan,
				// kodePos: req.body.kode_post,
				// detailAlamat: req.body.detail_alamat,
				// latitude: req.body.latitude,
				// longitude: req.body.longitude,
				userId: req.user.id
			},
			update: {
				provinsi: req.body.provinsi,
				kabupaten: req.body.kabupaten,
				// kecamatan: req.body.kecamatan,
				// kodePos: req.body.kode_post,
				// detailAlamat: req.body.detail_alamat,
				// latitude: req.body.latitude,
				// longitude: req.body.longitude,
			}
		})
		res.json(createAlamat)
	} catch (e) {
		next(e)
	}
}