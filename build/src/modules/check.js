import prisma from "../db.js";
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
export const checkAlamat = async (req, res, next) => {
    try {
        const alamat = await prisma.alamat.findUnique({
            where: {
                userId: req.user.id
            }
        });
        if ((alamat.provinsi === "") || (alamat.kabupaten === null) || (alamat.detailAlamat === null)) {
            res.status(428).json({ message: "Isi alamat terlebih dahulu" });
        }
        else {
            next();
        }
    }
    catch (e) {
        next(e);
    }
};
//# sourceMappingURL=check.js.map