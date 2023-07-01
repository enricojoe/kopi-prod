import { Router } from "express";
import { getPosFee, addPostingDoc } from "../handlers/pos.js";
import { loggedOn } from "../modules/auth.js";
const pos_router = Router();
pos_router.post("/getHarga", loggedOn, getPosFee);
pos_router.post("/kirim", loggedOn, addPostingDoc);
export default pos_router;
//# sourceMappingURL=pos.router.js.map