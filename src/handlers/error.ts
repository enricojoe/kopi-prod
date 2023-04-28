export const errorHandler = (err, req, res, next) => {
	if (err.type === 'auth') {
		res.status(401).json({message: "Tidak terauth"})
	} else if (err.type === 'input') {
		res.status(400).json({message: "masukan salah"})
	} else {
		console.log(err)
		res.status(500).json({message: "Kesalahan kami"})
	}
}