import express, { Router } from "express";
import { resolve } from "path";
import { cfg } from "../../config.js";
import { join } from "path";
import view from "./view.js";
import settings from "./settings.js";
import ip from "./ip.js";
import guide from "./guide.js";
import api from "./api.js";
import index from "./index.js";

const rootRoute = Router();

rootRoute.use(function (req, res, next) {
    console.log(`[${Date.now()}] ${req.method} @ ${req.path}`);
    console.log(`Request headers:`)
    console.dir(req.headers);
    console.log(`Request body:`);
    console.dir(req.body);
    next();
});

rootRoute.use("/", express.static(resolve(cfg.directories.public)), index);
rootRoute.use("/api", api);
rootRoute.use("/guide", guide);
rootRoute.use("/ip", ip);
rootRoute.use("/settings", settings);
rootRoute.use("/view", view);

export default rootRoute;