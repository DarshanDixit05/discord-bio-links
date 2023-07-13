// @ts-check
// This is a script to convert all the JSON5 files to standard JSON.
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import * as HJSON from "hjson";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const inDir = resolve(__dirname, "hjson");
const outDir = resolve(__dirname, "json");

console.log(`Starting.`);

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