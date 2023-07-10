import { Router } from "express";
import api from "./api/api.js";

const router = Router();

router.use("/", api);

export default router;