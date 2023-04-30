import { Router } from "express";
import { createProduct, getUserProducts, getAllProducts, getProductById, updateProduct, deleteProduct } from "../handlers/produk"
import { loggedOn } from "../modules/auth"
import { handleMultipartData } from "../config"

const produk_router = Router()

produk_router.get("/", getAllProducts)
produk_router.post("/tambah-produk", loggedOn, createProduct)
produk_router.post("/list-produk", loggedOn, getUserProducts)
produk_router.get("/:produkId", loggedOn, getProductById)
produk_router.post("/:produkId", loggedOn, updateProduct)
produk_router.delete("/:produkId", loggedOn, deleteProduct)

// authentikasi
// produk

export default produk_router