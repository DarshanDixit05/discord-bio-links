import { Router } from "express";
import { cfg } from "../../config.js";
import { isValidDiscordId } from "../../helpers/isValidDiscordId.js";
import { join } from "path";

const view = Router();

view.get("/view/:id", function (req, res) {
    const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());

    for (const lang of acceptedLanguages) {
        if (!res.headersSent) {
            if (lang.includes("fr")) {
                res.render(
                    join("french", "view.ejs")
                );
            }
        }
    }

    // Fallback language: English
    if (!res.headersSent) res.render(
        join("english", "view.ejs")
    );
});

export default view;