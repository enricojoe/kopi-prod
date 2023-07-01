import { Router } from "express";
import { getPosFee, addPostingDoc } from "../handlers/pos"
import { loggedOn } from "../modules/auth"
import { checkToko, checkAlamat } from "../modules/check"

const pos_router = Router()

pos_router.post("/getHarga", loggedOn, getPosFee)
pos_router.post("/kirim", loggedOn, addPostingDoc)

export default pos_router