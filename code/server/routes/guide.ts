import { Router } from "express";
import { join } from "path";

const guide = Router();

guide.get("/", function (req, res) {
    const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());

    for (const lang of acceptedLanguages) {
        if (!res.headersSent) {
            if (lang.includes("fr")) {
                res.render(join("french", "guide.ejs"));
            }
        }
    }

    // Fallback language: English
    if (!res.headersSent) res.render(join("english", "guide.ejs"));
});

export default guide;