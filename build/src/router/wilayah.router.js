import { Router } from "express";
import { getProvinces, getRegencies, getDistricts, getVillages } from "../handlers/wilayah.js";
import redis from "../modules/redis.js";
const wilayah_router = Router();
wilayah_router.get("/provinsi", redis.getCached, getProvinces);
wilayah_router.get("/kabupaten", redis.getCached, getRegencies);
wilayah_router.get("/kecamatan", redis.getCached, getDistricts);
wilayah_router.get("/desa", redis.getCached, getVillages);
export default wilayah_router;
//# sourceMappingURL=wilayah.router.js.map