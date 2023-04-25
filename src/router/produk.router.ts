import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../handlers/produk"
import { loggedOn } from "../modules/auth"

const produk_router = Router()

produk_router.post("/tambah-produk", loggedOn, createProduct)
produk_router.post("/list-produk", loggedOn, getProducts)
produk_router.get("/:produkId", loggedOn, getProductById)
produk_router.post("/:produkId", loggedOn, updateProduct)
produk_router.delete("/:produkId", loggedOn, deleteProduct)

// authentikasi
// produk

export default produk_router