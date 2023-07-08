import { Router } from "express";
import { join } from "path";

const router = Router();

router.get("/settings", function (req, res) {
    const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());

    for (const lang of acceptedLanguages) {
        if (!res.headersSent) {
            if (lang.includes("fr")) {
                res.render(join("french", "settings.ejs"));
            }
        }
    }

    // Fallback language: English
    if (!res.headersSent) res.render(join("english", "settings.ejs"));
});

export default router;