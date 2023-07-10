import { Router } from "express";
import { join } from "path";

const index = Router();

index.get("/", function (req, res) {
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

export default index;