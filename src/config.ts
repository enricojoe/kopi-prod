import multer from 'multer'
import dotenv  from "dotenv"
import path from "path"
import { v2 as cloudinary } from 'cloudinary'
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

dotenv.config()

// Multer Configuration
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
  	} else {
      cb(null, false);
      return cb(new Error('Ekstensi file yang dapat diterima hanya .png, .jpeg, dan .jpg'));
    }
}

export const handleMultipartData = multer({
	storage,
	fileFilter,
	limit: { fileSize: 3000000 * 1 },
});

// Cloudinary Configuration 
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});

export const uploadImage = async (file, folder) => {
	const extName = path.extname(file.originalname).toString()
	let file64 = parser.format(extName, file.buffer)
	const result = await cloudinary.uploader.upload(
		file64.content,
		{
			folder: folder,
			public_id: `${folder}-${Date.now()}-${Math.round(Math.random() * 1e3)}`,
			quality: 60
		}
	)

	return result.secure_url
}