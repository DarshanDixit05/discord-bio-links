import { NextFunction, Request, Response } from "express";
import { getSupportedMostPreferredLanguage } from "../../../languages.js";

export async function getSupportedLang(req: Request, res: Response, next: NextFunction) {
    try {
        const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());
        const mostPreferredSupportedLanguage = getSupportedMostPreferredLanguage(acceptedLanguages);

        res.json(mostPreferredSupportedLanguage);
    } catch (err) {
        next(err);
    }
};