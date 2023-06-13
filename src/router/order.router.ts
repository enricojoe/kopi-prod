import { Router } from "express";
import { tes, createOrder, getUserOrderDetail, getMyOrderDetail, finishOrder, getMerchantOrder, updateOrder, cancelOrder, getMyOrder, transactionResult } from "../handlers/order"
import { loggedOn } from "../modules/auth"
import { checkToko, checkAlamat } from "../modules/check"

const order_router = Router()

order_router.get("/tes", tes)
order_router.get("/", loggedOn, getMyOrder)
order_router.get("/pesanan/:orderId", loggedOn, getMyOrderDetail)
order_router.post("/beli", loggedOn, checkAlamat, createOrder)
order_router.get("/toko", loggedOn, checkToko, getMerchantOrder)
order_router.get("/toko/:orderTokoId", loggedOn, checkToko, getUserOrderDetail)
order_router.post("/notifikasi", transactionResult)
order_router.patch("/update/:orderTokoId", loggedOn, checkToko, updateOrder)
order_router.post("/batalkan/:orderId", loggedOn, cancelOrder)
order_router.post("/selesai/:orderId", loggedOn, finishOrder)

export default order_router