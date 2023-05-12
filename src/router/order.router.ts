import { Router } from "express";
import { instantBuy, dummyPay } from "../handlers/order"
import { loggedOn } from "../modules/auth"

const order_router = Router()

order_router.post("/:produkId", loggedOn, instantBuy)
order_router.patch("/:orderId", loggedOn, dummyPay)

export default order_router