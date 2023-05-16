import { Prisma } from '@prisma/client'

export const errorHandler = (err, req, res, next) => {
	if (err.type === 'auth') {
		res.status(401).json({message: "Tidak terauth"})
	} else if (err.type === 'input') {
		res.status(400).json({message: "masukan salah"})
	} else {
		console.log(err.message)
	
		res.status(500).json({message: "Kesalahan kami"})
	}
}

export const userErrorHandler = (err, req, res, next) => {
	if (err.code === "P2002") {
		res.status(409).json({ message: "Username sudah digunakan" })
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		res.status(406).json({ message: "Input salah" })
	} else if (err.message === "username") {
		res.status(401).json({ message: "Username salah" })
	} else if (err.message === "password") {
		res.status(401).json({ message: "Password salah" })
	} else {
		res.status(500).json({ message: "Kesalahan kami" })
	}
}

export const produkErrorHandler = (err, req, res, next) => {
	if (err.code === "P2002") {
		res.status(409).json({ message: "Username sudah digunakan" })
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		res.status(406).json({ message: "Input salah" })
	} else if (err.message === "username") {
		res.status(401).json({ message: "Username salah" })
	} else if (err.message === "password") {
		res.status(401).json({ message: "Password salah" })
	} else {
		res.status(500).json({ message: "Kesalahan kami" })
	}
}