import { Router } from "express";
import user_router from "./user.router"
import produk_router from "./produk.router"

const router = Router()
router.use("/user", user_router)
router.use("/produk", produk_router)

router.get("/", (req, res) => {
	res.send("Hallo world")
})

export default router