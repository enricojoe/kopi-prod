import { Router } from "express";
import { getProvinces, getRegencies, getDistricts, getVillages } from "../handlers/wilayah.js";
const wilayah_router = Router();
wilayah_router.get("/provinsi", getProvinces);
wilayah_router.get("/kabupaten", getRegencies);
wilayah_router.get("/kecamatan", getDistricts);
wilayah_router.get("/desa", getVillages);
export default wilayah_router;
//# sourceMappingURL=wilayah.router.js.map