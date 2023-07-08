import express, { Router } from "express";
import { resolve } from "path";
import { cfg } from "../../config.js";
import { join } from "path";
import rateLimit from 'express-rate-limit'

const router = Router();

router.use("/", express.static(resolve(cfg.directories.public)));

router.get("/", function (req, res) {
    const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());

    for (const lang of acceptedLanguages) {
        if (!res.headersSent) {
            if (lang.includes("fr")) {
                res.render(join("french", "index.ejs"));
            }
        }
    }

    // Fallback language: English
    if (!res.headersSent) res.render(join("english", "index.ejs"));
});

export default router;