import { Router } from "express";
import { serveIndexPage } from "../controllers/pages/serveIndexPage.js";

const index = Router();
index.get("/", serveIndexPage);

export default index;