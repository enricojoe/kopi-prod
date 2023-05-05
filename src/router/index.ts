import { Router } from "express";
import user_router from "./user.router"
import produk_router from "./produk.router"
import keranjang_router from "./keranjang.router"
import kategori_router from "./kategori.router"

const router = Router()
router.use("/user", user_router)
router.use("/produk", produk_router)
router.use("/keranjang", keranjang_router)
router.use("/kategori", kategori_router)

export default router