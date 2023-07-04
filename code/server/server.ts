import express from "express";
import { allFilesInDir } from "../helpers/allFilesInDir.js";
import { cfg } from "../config.js";
import { relative } from "path";

const appServer = express();
const routePaths: string[] = await allFilesInDir(cfg.directories.routes, true);

for (const routePath of routePaths) {
    const route = (await import(`file://${routePath}`)).default;
    appServer.use("", route);
    console.log(`Loaded route ${relative(cfg.directories.routes, routePath)} !`);
}

export { appServer };

