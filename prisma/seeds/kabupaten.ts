import { parse } from "csv-parse"
import fs from "fs"

export default async () => {
	var list_kabupaten = []
	await new Promise((resolve, reject) => {
		fs.createReadStream("./prisma/seeds/files/regencies.csv")
		.pipe(parse({ from_line: 2, delimiter: ','}))
		.on('data', row => {
			list_kabupaten.push({
				kode: row[4],
				kodeKabupaten: row[3],
				tipe: row[0],
				kabupaten: row[1],
				kodeProvinsi: row[2]
			})
		})
		.on('end', () => {
			resolve(list_kabupaten);
		})
		.on('error', error => {
			reject(error);
		})
	});

	return list_kabupaten
}