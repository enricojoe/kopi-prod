import prisma from "../db"
import { getPostalCode, getFee } from "../modules/pos"

export const getPosFee = async (req, res, next) => {
	try {
		const fee = await getFee()
		res.status(200).json({ data: fee.rs_fee.r_fee })
	} catch (e) {
		next(e)
	}
}