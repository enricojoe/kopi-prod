import { Router } from "express";
import { createCategory, getAllCategory, getCategoryProduct, updateCategory, deleteCategory } from "../handlers/kategori"
import { loggedOn } from "../modules/auth"
import redis from "../modules/redis"
import { handleMultipartData } from "../config"

const kategori_router = Router()

kategori_router.get("/", redis.getCached, getAllCategory)
kategori_router.post("/tambah", handleMultipartData.single("gambar"), loggedOn, createCategory)
kategori_router.get("/:kategoriId", redis.getCached, getCategoryProduct)
kategori_router.patch("/:kategoriId", handleMultipartData.single("gambar"), loggedOn, updateCategory)
kategori_router.delete("/:kategoriId", loggedOn, deleteCategory)

export default kategori_router