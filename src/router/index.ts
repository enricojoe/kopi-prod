import { Router } from "express";
import user_router from "./user.router"

const router = Router()
router.use("/user", user_router)

router.get("/", (req, res) => {
	res.send("Hallo world")
})

export default router