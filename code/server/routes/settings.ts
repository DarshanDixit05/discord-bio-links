import { Router } from "express";
import { join, resolve } from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { cfg } from "../../config.js";
import { getSupportedMostPreferredLanguage } from "../../languages.js";
import { User } from "../../structures/User.js";
import { InternalUser } from "../../structures/InternalUser.js";
import cookieParser from "cookie-parser";

const i18n = i18next.createInstance();

await i18n.use(Backend).init({
    fallbackLng: 'us',
    ns: [
        "footer",
        "settings",
        "header"
    ],
    backend: {
        loadPath: cfg.translationsPath
    }
});

const translate = i18n.t;

const settings = Router();

settings.get("/", cookieParser(), async function (req, res, next) {
    try {
        const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());
        const mostPreferredSupportedLanguage = getSupportedMostPreferredLanguage(acceptedLanguages);

        await i18n.changeLanguage(mostPreferredSupportedLanguage);

        let user: User | null = null;
        let authLink: string | null = null;

        if (req.cookies.session && typeof req.cookies.session === "string") {
            const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));

            try {
                user = await (new InternalUser(userId)).get();
            } catch (err) {
                console.error(err);
            }
        }

        res.render("settings.ejs", {
            user,
            lang: mostPreferredSupportedLanguage,
            authLink,
            origin: cfg.client.redirectUri,
            translations: {
                catchline: translate("catchline", { ns: "header" }),
                logout: translate("logout", { ns: "settings" }),
                delete: translate("delete", { ns: "settings" }),
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

export default settings;