import { NextFunction, Request, Response } from "express";
import { cfg } from "../../../config.js";
import { prepareI18n } from "../../../helpers/prepareI18n.js";
import i18next from "i18next";
import { changeI18nToCorrectLanguage } from "../../../helpers/changeI18nToCorrectLanguage.js";
import { InternalUser } from "../../../structures/InternalUser.js";

const i18n = i18next.createInstance();

await prepareI18n(i18n, [
    "settings",
    "footer",
    "header",
    "common"
]);

const translate = i18n.t;

function translations(): object {
    return {
        header: {
            catchline: translate("catchline", { ns: "header" })
        },
        footer: {
            main: translate("main", { ns: "footer" }),
            sourceCode: translate("github", { ns: "footer" }),
            donate: translate("donate", { ns: "footer" }),
            guide: translate("guide", { ns: "footer" }),
            settings: translate("settings", { ns: "footer" })
        },
        logout: translate("logout", { ns: "settings" }),
        delete: translate("delete", { ns: "settings" }),
    };
}

export async function serveSettingsPage(req: Request, res: Response, next: NextFunction) {
    try {
        await changeI18nToCorrectLanguage(i18n, req);
        if (typeof req.cookies.session !== "string") res.redirect("/");

        const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));
        const user = await (new InternalUser(userId)).get();

        res.render("settings.ejs", {
            user,
            lang: i18n.language,
            origin: cfg.client.redirectUri,
            translations: translations()
        });
    } catch (err) {
        res.cookie("session", "");
        res.redirect("/");
    }
}