export const errorHandler = (err, req, res, next) => {
	if (err.type === 'auth') {
		res.status(401).json({pesan: "Tidak terauth"})
	} else if (err.type === 'input') {
		res.status(400).json({pesan: "masukan salah"})
	} else {
		res.status(500).json({pesan: "Kesalahan kami"})
	}
}