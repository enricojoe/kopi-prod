import { Router } from "express";
import user_router from "./user.router.js";
import produk_router from "./produk.router.js";
import keranjang_router from "./keranjang.router.js";
import kategori_router from "./kategori.router.js";
import order_router from "./order.router.js";
import pos_router from "./pos.router.js";
import { userErrorHandler, prismaErrorHandler } from "../handlers/error.js";
const router = Router();
router.use("/user", user_router, prismaErrorHandler, userErrorHandler);
router.use("/produk", produk_router);
router.use("/keranjang", keranjang_router);
router.use("/kategori", kategori_router);
router.use("/order", order_router);
router.use("/pos", pos_router);
export default router;
//# sourceMappingURL=index.js.map