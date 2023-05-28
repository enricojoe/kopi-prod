import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'

import router from './src/router/index'
import { errorHandler } from './src/handlers/error'

const app = express();
const port = 5000;

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);
app.use(errorHandler)

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})