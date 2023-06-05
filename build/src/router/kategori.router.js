import { Router } from "express";
import { createCategory, getAllCategory, getCategoryProduct, updateCategory, deleteCategory } from "../handlers/kategori.js";
import { loggedOn } from "../modules/auth.js";
import { handleMultipartData } from "../config.js";
const kategori_router = Router();
kategori_router.get("/", getAllCategory);
kategori_router.post("/tambah", handleMultipartData.single("gambar"), loggedOn, createCategory);
kategori_router.get("/:kategoriId", getCategoryProduct);
kategori_router.patch("/:kategoriId", handleMultipartData.single("gambar"), loggedOn, updateCategory);
kategori_router.delete("/:kategoriId", loggedOn, deleteCategory);
export default kategori_router;
//# sourceMappingURL=kategori.router.js.map