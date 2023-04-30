import { Router } from "express";
import { createOrder, getUserCart, deleteOrder, updateCart } from "../handlers/keranjang"
import { loggedOn } from "../modules/auth"

const keranjang_router = Router()

keranjang_router.get("/", loggedOn, getUserCart)
keranjang_router.post("/update-keranjang", loggedOn, updateCart)
keranjang_router.post("/:produkId", loggedOn, createOrder)
keranjang_router.delete("/:produkId", loggedOn, deleteOrder)

// authentikasi
// produk

export default keranjang_router