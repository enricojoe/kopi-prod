import { Router } from "express";
import { createProduct, getUserProducts, searchProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../handlers/produk"
import { loggedOn } from "../modules/auth"
import { checkToko, checkAlamat } from "../modules/check"
import redis from "../modules/redis"
import { handleMultipartData } from "../config"

const produk_router = Router()

produk_router.get("/", redis.getCached, getAllProducts)
produk_router.get("/cari", redis.getCached, searchProduct)
produk_router.get("/ambil/:produkId", redis.getCached, getProductById)
produk_router.get("/toko/:tokoId", redis.getCached, getUserProducts)
produk_router.post("/tambah", loggedOn, checkToko, checkAlamat, handleMultipartData.single("gambar_produk"), createProduct)
produk_router.patch("/:produkId", loggedOn, checkToko, handleMultipartData.single("gambar_produk"), updateProduct)
produk_router.delete("/:produkId", loggedOn, checkToko, deleteProduct)

export default produk_router