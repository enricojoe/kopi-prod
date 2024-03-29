import { Router } from "express";
import user_router from "./user.router"
import produk_router from "./produk.router"
import keranjang_router from "./keranjang.router"
import kategori_router from "./kategori.router"
import order_router from "./order.router"
import pos_router from "./pos.router"
import wilayah_router from "./wilayah.router"
import { userErrorHandler, prismaErrorHandler } from "../handlers/error"

const router = Router()
router.use("/user", user_router, prismaErrorHandler, userErrorHandler)
router.use("/produk", produk_router)
router.use("/keranjang", keranjang_router)
router.use("/kategori", kategori_router)
router.use("/order", order_router)
router.use("/pos", pos_router)
router.use("/wilayah", wilayah_router)

export default router