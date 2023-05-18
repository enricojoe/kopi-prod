export const checkAdmin = (req, res, next) => {
	if (req.user.role[0] === "A001") {
		next(e)
	}
}