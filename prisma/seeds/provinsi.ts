import { parse } from "csv-parse"
import fs from "fs"

export default async () => {
	var list_provinsi = []
	await new Promise((resolve, reject) => {
		fs.createReadStream("./prisma/seeds/files/provinces.csv")
		.pipe(parse({ from_line: 2, delimiter: ','}))
		.on('data', row => {
			list_provinsi.push({
				kode: row[1],
				provinsi: row[0]
			})
		})
		.on('end', () => {
			resolve(list_provinsi);
		})
		.on('error', error => {
			reject(error);
		})
	});

	return list_provinsi
}