import i18next from "i18next";
import { Request } from "express";
import { getSupportedMostPreferredLanguage } from "../languages.js";

export async function changeI18nToCorrectLanguage(i18n: i18next.i18n, req: Request): Promise<void> {
    const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());
    const mostPreferredSupportedLanguage = getSupportedMostPreferredLanguage(acceptedLanguages);

    await i18n.changeLanguage(mostPreferredSupportedLanguage);
}