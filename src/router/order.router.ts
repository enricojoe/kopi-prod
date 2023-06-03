import { Router } from "express";
import { createOrder, getUserOrderDetail, getMyOrderDetail, getMerchantOrder, updateOrder, cancelOrder, getMyOrder, transactionResult } from "../handlers/order"
import { loggedOn } from "../modules/auth"
import { checkToko } from "../modules/checkRole"

const order_router = Router()

order_router.get("/", loggedOn, getMyOrder)
order_router.get("/pesanan/:orderId", loggedOn, getMyOrderDetail)
order_router.post("/beli", loggedOn, createOrder)
order_router.get("/toko", loggedOn, checkToko, getMerchantOrder)
order_router.get("/toko/:orderTokoId", loggedOn, checkToko, getUserOrderDetail)
order_router.post("/notifikasi", transactionResult)
order_router.patch("/update/:orderTokoId", loggedOn, checkToko, updateOrder)
order_router.patch("/batalkan/:orderId", loggedOn, cancelOrder)

export default order_router