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
		// const bearer = req.headers.authorization || req.headers.Authorization
		// const [, token] = bearer.split(' ')

		// if (!token) {
		// 	res.status(401)
		// 	res.json({message: "Token tidak valid"})
		// 	return
		// }

		// try {
		// 	const user = jwt.verify(token, process.env.JWT_SECRET)
		// 	req.user = user
		// } catch (e) {
		// 	console.log(e)
		// 	res.status(401)
		// 	res.json({message: "Tidak authorized"})
		// 	return
		// }
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