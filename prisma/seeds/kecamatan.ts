import { parse } from "csv-parse"
import fs from "fs"

export default async () => {
	var list_kecamatan = []
	await new Promise((resolve, reject) => {
		fs.createReadStream("./prisma/seeds/files/districts.csv")
		.pipe(parse({ from_line: 2, delimiter: ','}))
		.on('data', row => {
			list_kecamatan.push({
				kode: row[5],
				kodeKecamatan: row[3],
				kecamatan: row[0],
				kodeKabupaten: row[4],
			})
		})
		.on('end', () => {
			resolve(list_kecamatan);
		})
		.on('error', error => {
			reject(error);
		})
	});

	return list_kecamatan
}