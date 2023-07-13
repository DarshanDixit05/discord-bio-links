import { resolve } from "path";
import { existsSync } from "fs";
import { cfg } from "./config.js";

const langs = {
    us: 1,
    fr: 1
}

for (const lang of Object.keys(langs)) {
    if (!existsSync(resolve(cfg.directories.public, "locales", lang))) {
        throw new Error(`No translations in /public/locales/${lang} !`);
    }
}

function getSupportedMostPreferredLanguage(preferredLangs: string[]): string {
    return preferredLangs.find((lang: string) => lang in langs) || "us";
}

export { langs, getSupportedMostPreferredLanguage };