import prisma from '../db'
import { hashPassword, comparePassword, createJWT } from "../modules/auth"

// terdapat 3 jenis akun
// Pembeli (R101)
// Toko (R101, R102)
// Koperasi (R101, R102, R103, R104)
// terdapat 4 jenis role
// R101 : Dapat membeli
// R102 : Dapat menjual
// R103 : Dapat bertransaksi dengan koperasi lain
// R104 : Dapat membuat akun toko


// Untuk membuat akun
// Request: (note: req.body berarti dari form)
// - Username : req.body.username
// - Password : req.body.password
// - namaLengkap : req.body.nama_lengkap
// - jenisAkun : req.body.jenis_akun
// Response:
// - Token JWT
export const createNewUser = async (req, res, next) => {
	try {
		const user = await prisma.user.create({
			data: {
				username: req.body.username,
				password: await hashPassword(req.body.password),
				namaLengkap: req.body.nama_lengkap,
				noIndukKoperasi: req.body.no_induk_koperasi,
				jenisAkun: req.body.jenis_akun
			}
		})
		const token = createJWT(user)
		res.json({ token })
	} catch (e) {
		e.type = 'input'
		next(e)
	}
}

// Untuk masuk 
// Request:
// - Username : req.body.username
// - Password : req.body.password
// Response:
// - Token JWT
// - Data user
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
		res.json({ token, user })
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
			},
			include: {
				alamat: true
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
				noIndukKoperasi: req.body.no_induk_koperasi
			}
		})
		res.json({ updateUser })
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
				kecamatan: req.body.kecamatan,
				kodePos: req.body.kode_post,
				detailAlamat: req.body.detail_alamat,
				latitude: req.body.latitude,
				longitude: req.body.longitude,
				userId: req.user.id
			},
			update: {
				provinsi: req.body.provinsi,
				kabupaten: req.body.kabupaten,
				kecamatan: req.body.kecamatan,
				kodePos: req.body.kode_post,
				detailAlamat: req.body.detail_alamat,
				latitude: req.body.latitude,
				longitude: req.body.longitude,
			}
		})
		res.json({ createAlamat })
	} catch (e) {
		next(e)
	}
}