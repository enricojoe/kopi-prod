import { Router } from "express";
import { createNewUser, signIn, profile, updateProfile, updateAlamat } from "../handlers/user"
import { loggedOn } from "../modules/auth"
import { handleMultipartData } from "../config"

const user_router = Router()

user_router.post("/daftar", createNewUser)
user_router.post("/masuk", signIn)
user_router.get("/profile", loggedOn, profile)
user_router.patch("/update/profile", loggedOn, handleMultipartData.single("gambar"), updateProfile)
user_router.patch("/update/alamat", loggedOn, updateAlamat)

export default user_router