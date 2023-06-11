import { Router } from "express";
import { getPosFee } from "../handlers/pos.js";
// import { loggedOn } from "../modules/auth"
const pos_router = Router();
pos_router.get("/getHarga", getPosFee);
export default pos_router;
//# sourceMappingURL=pos.router.js.map