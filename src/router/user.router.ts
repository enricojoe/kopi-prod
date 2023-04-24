import { Router } from "express";
import { createNewUser, signin, profile, updateProfile, updateAlamat } from "../handlers/user"
import { loggedOn } from "../modules/auth"

const user_router = Router()

// user_router.get("/", loggedOn, (req, res) => {
// 	res.send("Hello, ini bagian user. Saya sudah LOGIN LOOOOOH")
// })
user_router.post("/registrasi", createNewUser)
user_router.post("/masuk", signin)
user_router.post("/", loggedOn, profile)
user_router.post("/perbarui", loggedOn, updateProfile)
user_router.post("/perbaruialamat", loggedOn, updateAlamat)

// authentikasi
// produk

export default user_router