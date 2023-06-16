import { Router } from "express";
import { getNotificationById, getAllNotification } from "../handlers/notifikasi.js";
import { loggedOn } from "../modules/auth.js";
const notifikasi_router = Router();
notifikasi_router.get("/", loggedOn, getAllNotification);
notifikasi_router.get("/baca/:notifikasiId", loggedOn, getNotificationById);
export default notifikasi_router;
//# sourceMappingURL=notifikasi.router.js.map