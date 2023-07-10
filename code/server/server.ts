import express from "express";
import { cfg } from "../config.js";
import { resolve } from "path";
import rootRoute from "./routes/root.js";
import { errorHandler } from "./errorHandler.js";

const appServer = express();
appServer.set("trust proxy", cfg.numberOfProxies);
// See ip.ts for more info.

appServer.set('views', resolve(cfg.directories.public, "views"));
appServer.set('view engine', 'ejs');

appServer.use(rootRoute);
appServer.use(errorHandler);

export { appServer };