import prisma from "../db"

export const createOrder = async (req, res, next) => {
	try {
		const order = await prisma.order.create({
			data: {
				
			}
		})
	} catch (e) {

	}
}