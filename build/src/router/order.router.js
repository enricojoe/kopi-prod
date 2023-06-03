import { Router } from "express";
import { createOrder, getUserOrderDetail, getMyOrderDetail, finishOrder, getMerchantOrder, updateOrder, cancelOrder, getMyOrder, transactionResult } from "../handlers/order.js";
import { loggedOn } from "../modules/auth.js";
import { checkToko } from "../modules/checkRole.js";
const order_router = Router();
order_router.get("/", loggedOn, getMyOrder);
order_router.get("/pesanan/:orderId", loggedOn, getMyOrderDetail);
order_router.post("/beli", loggedOn, createOrder);
order_router.get("/toko", loggedOn, checkToko, getMerchantOrder);
order_router.get("/toko/:orderTokoId", loggedOn, checkToko, getUserOrderDetail);
order_router.post("/notifikasi", transactionResult);
order_router.patch("/update/:orderTokoId", loggedOn, checkToko, updateOrder);
order_router.post("/batalkan/:orderId", loggedOn, cancelOrder);
order_router.post("/selesai/:orderTokoId", loggedOn, finishOrder);
export default order_router;
//# sourceMappingURL=order.router.js.map