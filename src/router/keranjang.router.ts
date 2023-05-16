import { Router } from "express";
import { createCartItem, getUserCart, deleteCartItem, updateCart } from "../handlers/keranjang"
import { loggedOn } from "../modules/auth"

const keranjang_router = Router()

keranjang_router.get("/", loggedOn, getUserCart)
keranjang_router.patch("/:produkId", loggedOn, updateCart)
keranjang_router.post("/:produkId", loggedOn, createCartItem)
keranjang_router.delete("/:produkId", loggedOn, deleteCartItem)

export default keranjang_router