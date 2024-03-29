import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import { errorHandler } from './src/handlers/error'
import router from './src/router/index'

const app = express();
const port = 5000;

app.use(cors({
    origin: "*",
    methods: ['GET','POST','DELETE','UPDATE','PATCH']
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);
app.use(errorHandler)

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})