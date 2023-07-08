import express from "express";
import { allFilesInDir } from "../helpers/allFilesInDir.js";
import { cfg } from "../config.js";
import { relative, resolve } from "path";

const appServer = express();
appServer.set("trust proxy", cfg.numberOfProxies);
// See ip.ts for more info.

const routePaths: string[] = await allFilesInDir(cfg.directories.routes, true);

for (const routePath of routePaths) {
    const route = (await import(`file://${routePath}`)).default;

    appServer.use("", async function (req, res, next) {
        try {
            await route(req, res, next);
        } catch (err) {
            console.error(err);
        }
    });

    console.log(`Loaded route ${relative(cfg.directories.routes, routePath)} !`);
}

appServer.set('views', resolve(cfg.directories.public, "views"));
appServer.set('view engine', 'ejs');

export { appServer };

