import express, { Router } from "express";
import { LoginAttemptManager } from "../../../../structures/LoginAttemptManager.js";
import { createAuthUrl } from "../../../../helpers/createAuthUrl.js";
import { cfg } from "../../../../config.js";
import { getSupportedMostPreferredLanguage } from "../../../../helpers/getSupportedMostPreferredLanguage.js";

const supported = Router();

supported.get("/", async function (req, res, next) {
    try {
        const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());
        const mostPreferredSupportedLanguage = getSupportedMostPreferredLanguage(acceptedLanguages);

        res.json(mostPreferredSupportedLanguage);
    } catch (err) {
        next(err);
    }
});

export default supported; 