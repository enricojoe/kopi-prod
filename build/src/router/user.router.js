import { Router } from "express";
import { createNewUser, signIn, profile, updateProfile, updateAlamat, merchant, merchantInfo } from "../handlers/user.js";
import { loggedOn } from "../modules/auth.js";
import { handleMultipartData } from "../config.js";
const user_router = Router();
user_router.post("/daftar", createNewUser);
user_router.post("/masuk", signIn);
user_router.get("/profile/toko", loggedOn, merchantInfo);
user_router.get("/profile/produk", loggedOn, merchant);
user_router.get("/profile", loggedOn, profile);
user_router.patch("/update/profile", loggedOn, handleMultipartData.single("gambar"), updateProfile);
user_router.patch("/update/alamat", loggedOn, updateAlamat);
export default user_router;
//# sourceMappingURL=user.router.js.map