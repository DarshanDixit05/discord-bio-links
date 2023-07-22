import { Router } from "express";
import { serverViewPage } from "../controllers/pages/serveViewPage.js";

const view = Router();
view.get("/:id", serverViewPage);

export default view;