// This is a script to convert all the JSON5 files to standard JSON.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { basename, dirname, resolve } from "path";
import * as HJSON from "hjson";
import { fileURLToPath } from "url";
import { cfg } from "../config.js";

const rawDir = resolve(cfg.directories.public, "locales", "hjson");
console.log(`Converting HJSON translations to JSON.`);

for (const lang of readdirSync(rawDir)) {
    const inDir = resolve(rawDir, lang);
    const outDir = resolve(rawDir, "..", "json", lang);

    const shouldCreateDir = !existsSync(outDir);
    if (shouldCreateDir) mkdirSync(outDir, { recursive: true });

    const files = readdirSync(inDir).map(p => resolve(inDir, p));

    for (const file of files) {
        const outFile = resolve(outDir, basename(file).replace(".hjson", ".json"));
        const data = HJSON.parse(readFileSync(file, "utf8"));
        const json = JSON.stringify(data);
        writeFileSync(outFile, json);
    }
}

console.log(`Done.`);