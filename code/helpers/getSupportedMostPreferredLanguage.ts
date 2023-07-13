import { cfg } from "../config.js";
import { resolve } from "path";
import { existsSync } from "fs";

export function getSupportedMostPreferredLanguage(langs: string[]): string {
    return langs.find((lang: string) => existsSync(resolve(cfg.directories.public, "locales", lang))) || "en";
}