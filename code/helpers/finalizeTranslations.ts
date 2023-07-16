// This is a script to convert all the JSON5 files to standard JSON.
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import * as HJSON from "hjson";
import { fileURLToPath } from "url";
import { cfg } from "../config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const inDir = resolve(cfg.directories.public, "locales", "hjson");
const outDir = resolve(cfg.directories.translations);

console.log(`Converting HJSON translations to JSON.`);

for (const lang of readdirSync(inDir)) {
    for (const file of readdirSync(resolve(inDir, lang))) {
        writeFileSync(
            resolve(outDir, lang, file.replace(".hjson", ".json")),
            JSON.stringify(
                HJSON.parse(
                    readFileSync(resolve(inDir, lang, file), "utf8")
                )
            )
        );
    }
}

console.log(`Done.`);