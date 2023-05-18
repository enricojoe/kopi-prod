import { Router } from "express";
import { instantBuy, dummyPay, createOrder } from "../handlers/order"
import { loggedOn } from "../modules/auth"

const order_router = Router()

order_router.post("/beli", loggedOn, createOrder)
order_router.post("/:produkId", loggedOn, instantBuy)
order_router.patch("/:orderId", loggedOn, dummyPay)

export default order_router