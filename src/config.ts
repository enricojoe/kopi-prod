import multer from 'multer'
import dotenv  from "dotenv"
import path from "path"
const cloudinary = require('cloudinary').v2

dotenv.config()

// Multer Configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./upload"),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(
			Math.random() * 1e9
		)}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

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
