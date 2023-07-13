import { Router } from "express";
import { join, resolve } from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { cfg } from "../../config.js";
import { getSupportedMostPreferredLanguage } from "../../helpers/getSupportedMostPreferredLanguage.js";

const i18n = i18next.createInstance();

await i18n.use(Backend).init({
    fallbackLng: 'en',
    ns: [
        "footer",
        "header"
    ],
    backend: {
        loadPath: resolve(cfg.directories.public, 'locales/{{lng}}/{{ns}}.json')
    }
});

const translate = i18n.t;

const guide = Router();

guide.get("/", async function (req, res, next) {
    try {
        const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());
        const mostPreferredSupportedLanguage = getSupportedMostPreferredLanguage(acceptedLanguages);

        await i18n.changeLanguage(mostPreferredSupportedLanguage);

        res.render("guide.ejs", {
            lang: mostPreferredSupportedLanguage,
            origin: cfg.client.redirectUri,
            translations: {
                catchline: translate("catchline", { ns: "header" }),
                main: translate("main", { ns: "footer" }),
                sourceCode: translate("github", { ns: "footer" }),
                donate: translate("donate", { ns: "footer" }),
                guide: translate("guide", { ns: "footer" }),
                settings: translate("settings", { ns: "footer" }),
            }
        });
    } catch (err) {
        next(err);
    }
});

export default guide;