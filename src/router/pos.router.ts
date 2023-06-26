import { Router } from "express";
import { getPosFee, addPostingDoc } from "../handlers/pos"
// import { loggedOn } from "../modules/auth"

const pos_router = Router()

pos_router.get("/getHarga", getPosFee)
pos_router.post("/kirim", addPostingDoc)

export default pos_router