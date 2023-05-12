import { Router } from "express";
import { createCategory, getAllCategory, updateCategory, deleteCategory } from "../handlers/kategori"
import { loggedOn } from "../modules/auth"
import { handleMultipartData } from "../config"

const kategori_router = Router()

kategori_router.post("/tambah", handleMultipartData.single("gambar"), loggedOn, createCategory)
kategori_router.get("/", getAllCategory)
kategori_router.patch("/:kategoriId", handleMultipartData.single("gambar"), loggedOn, updateCategory)
kategori_router.delete("/:kategoriId", loggedOn, deleteCategory)

export default kategori_router