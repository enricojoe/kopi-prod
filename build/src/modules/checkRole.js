// export const checkAdmin = (req, res, next) => {
// 	if (req.user.role[0] === "A001") {
// 		next(e)
// 	}
// }
// export const checkKeranjang = (req, res, next) => {
// 	if (req.)
// }
export const checkToko = (req, res, next) => {
    if (req.user.role.includes("R102")) {
        next();
    }
    else {
        res.status(401).json({ message: "Tidak authorized" });
        return;
    }
};
//# sourceMappingURL=checkRole.js.map