import express from "express";
import { cfg } from "../config.js";
import { resolve } from "path";
import cookieParser from "cookie-parser";
import api from "./routes/api.route.js";
import index from "./routes/index.route.js";
import ip from "./routes/ip.route.js";
import settings from "./routes/settings.route.js";
import view from "./routes/view.route.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const appServer = express();
appServer.set("trust proxy", cfg.numberOfProxies);
// See ip.ts for more info.

appServer.set('views', resolve(cfg.directories.public, "views"));
appServer.set('view engine', 'ejs');

appServer.use(cookieParser());

appServer.use("/", index);
appServer.use("/api", express.json(), api);
appServer.use("/ip", ip);
appServer.use("/settings", settings);
appServer.use("/view", view);
appServer.use(express.static(cfg.directories.public));
appServer.use(errorHandler);

export { appServer };