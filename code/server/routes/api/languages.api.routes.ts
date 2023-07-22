import { Router } from "express";
import { getSupportedLang } from "../../controllers/languages/getSupportedLang.js";

const lang = Router();

lang.get("/", getSupportedLang);

export { lang };