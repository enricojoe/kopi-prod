import { Router } from "express";
import { createProduct, getUserProducts, getAllProducts, getProductById, updateProduct, deleteProduct } from "../handlers/produk"
import { loggedOn } from "../modules/auth"
import { handleMultipartData } from "../config"

const produk_router = Router()

produk_router.get("/", getAllProducts)
produk_router.post("/tambah", loggedOn, handleMultipartData.array("gambar_produk", 10), createProduct)
produk_router.get("/toko", loggedOn, getUserProducts)
produk_router.get("/:produkId", loggedOn, getProductById)
produk_router.patch("/:produkId", loggedOn, handleMultipartData.array("gambar_produk", 10), updateProduct)
produk_router.delete("/:produkId", loggedOn, deleteProduct)

export default produk_router