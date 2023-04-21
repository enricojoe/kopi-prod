import express from 'express'
import router from './src/router/index'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express();
const port = 3000;

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})