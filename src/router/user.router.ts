import { Router } from "express";
import { createNewUser, signin } from "../handlers/user"

const user_router = Router()

user_router.get("/", (req, res) => {
	res.send("Hello, ini bagian user")
})
user_router.post("/registrasi", createNewUser)
user_router.post("/masuk", signin)

export default user_router