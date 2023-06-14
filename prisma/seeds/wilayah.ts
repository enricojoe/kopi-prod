import { parse } from "csv-parse"
import fs from "fs"

fs.createReadStream("./migration_data.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
  })