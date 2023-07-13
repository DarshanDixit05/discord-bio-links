import { Router } from "express";
import { cfg } from "../../config.js";
import { resolve } from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { getSupportedMostPreferredLanguage } from "../../languages.js";
import { User } from "../../structures/User.js";
import { InternalUser } from "../../structures/InternalUser.js";

const i18n = i18next.createInstance();

await i18n.use(Backend).init({
    fallbackLng: 'us',
    ns: [
        "footer",
        "view",
        "errors",
        "header"
    ],
    backend: {
        loadPath: resolve(cfg.directories.public, 'locales/{{lng}}/{{ns}}.json')
    }
});

const translate = i18n.t;

const view = Router();

view.get("/:id", async function (req, res, next) {
    try {
        const acceptedLanguages = req.acceptsLanguages().map(lang => lang.toLowerCase());
        const mostPreferredSupportedLanguage = getSupportedMostPreferredLanguage(acceptedLanguages);

        await i18n.changeLanguage(mostPreferredSupportedLanguage);

        let user: User | null = null;

        try {
            user = await (new InternalUser(req.params.id)).get();
        } catch (err) {
            console.error(err);
        }

        res.render("view.ejs", {
            user,
            lang: mostPreferredSupportedLanguage,
            translations: {
                catchline: translate("catchline", { ns: "header" }),
                userNotFound: translate("user not found", { ns: "errors" }),
                main: translate("main", { ns: "footer" }),
                sourceCode: translate("github", { ns: "footer" }),
                donate: translate("donate", { ns: "footer" }),
                guide: translate("guide", { ns: "footer" }),
                settings: translate("settings", { ns: "footer" }),
                usernameDisplay: translate("username display", { ns: "view", username: (user === null) ? "" : user.username }),
                turnRawViewOn: translate("turn raw view on", { ns: "view" })
            }
        });
    } catch (err) {
        next(err);
    }
});

export default view;