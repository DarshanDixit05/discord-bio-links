// @ts-check
// This is a script to convert all the JSON5 files to standard JSON.
import JSON5 from 'json5';
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const inDir = resolve("json5");
const outDir = resolve("json");

console.log(`Starting.`);

for (const lang of readdirSync(inDir)) {
    for (const file of readdirSync(resolve(inDir, lang))) {
        writeFileSync(
            resolve(outDir, lang, file.replace(".json5", ".json")),
            JSON.stringify(
                JSON5.parse(
                    readFileSync(resolve(inDir, lang, file), "utf8")
                )
            )
        );
    }
}

console.log(`Done.`);