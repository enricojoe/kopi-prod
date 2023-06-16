import { parse } from "csv-parse"
import fs from "fs"

export default async () => {
	var list_desa = []
	await new Promise((resolve, reject) => {
		fs.createReadStream("./prisma/seeds/files/villages.csv")
		.pipe(parse({ from_line: 2, delimiter: ','}))
		.on('data', row => {
			list_desa.push({
				kode: row[6],
				kodeDesa: row[5],
				kodePos: row[0],
				desa: row[1],
				kodeKecamatan: row[7],
			})
		})
		.on('end', () => {
			resolve(list_desa);
		})
		.on('error', error => {
			reject(error);
		})
	});

	return list_desa
}