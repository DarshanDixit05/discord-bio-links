import { Router } from "express";
import { serveSettingsPage } from "../controllers/pages/serveSettingsPage.js";

const settings = Router();
settings.get("/", serveSettingsPage);

export default settings;