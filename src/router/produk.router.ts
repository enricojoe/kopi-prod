import { Router } from "express";
// import { visitorCounter } from "../handlers/user"
import { createProduct, getUserProducts, searchProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../handlers/produk"
import { loggedOn } from "../modules/auth"
import { checkToko } from "../modules/checkRole"
import { handleMultipartData } from "../config"

const produk_router = Router()

produk_router.get("/", getAllProducts)
produk_router.get("/cari", searchProduct)
produk_router.get("/ambil/:produkId", getProductById)
produk_router.get("/toko/:tokoId", getUserProducts)
produk_router.post("/tambah", loggedOn, checkToko, handleMultipartData.single("gambar_produk"), createProduct)
produk_router.patch("/:produkId", loggedOn, checkToko, handleMultipartData.single("gambar_produk"), updateProduct)
produk_router.delete("/:produkId", loggedOn, checkToko, deleteProduct)

export default produk_router