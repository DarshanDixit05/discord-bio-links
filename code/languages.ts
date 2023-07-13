import { resolve } from "path";
import { existsSync } from "fs";
import { cfg } from "./config.js";

const langs = {
    us: 1,
    fr: 1
}

for (const lang of Object.keys(langs)) {
    if (!existsSync(resolve(cfg.directories.translations, lang))) {
        throw new Error(`No translations in ${cfg.directories.translations}/${lang} !`);
    }
}

function getSupportedMostPreferredLanguage(preferredLangs: string[]): string {
    return preferredLangs.find((lang: string) => lang in langs) || "us";
}

function isSupportedLanguage(lang: string): boolean {
    if (lang in langs) return true;
    return false;
}

export { langs, getSupportedMostPreferredLanguage, isSupportedLanguage };