import { NextFunction, Request, Response } from "express";
import { cfg } from "../../../config.js";
import { prepareI18n } from "../../../helpers/prepareI18n.js";
import i18next from "i18next";
import { changeI18nToCorrectLanguage } from "../../../helpers/changeI18nToCorrectLanguage.js";
import { InternalUser } from "../../../structures/InternalUser.js";
import { User } from "../../../structures/User.js";

const i18n = i18next.createInstance();

await prepareI18n(i18n, [
    "footer",
    "view",
    "errors",
    "header"
]);

const translate = i18n.t;

function translations(user?: User | null): object {
    if (user === undefined) user = null;

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
        userNotFound: translate("user not found", { ns: "errors" }),
        usernameDisplay: translate("username display", { ns: "view", username: (user === null) ? "" : user.username }),
        turnRawViewOn: translate("turn raw view on", { ns: "view" })
    };
}

function renderWithNoUser(res: Response) {
    res.render("view.ejs", {
        user: null,
        lang: i18n.language,
        translations: translations()
    });
}

function renderWithUser(user: User, res: Response) {
    res.render("view.ejs", {
        user,
        lang: i18n.language,
        translations: translations(user)
    });
}

export async function serverViewPage(req: Request, res: Response, next: NextFunction) {
    await changeI18nToCorrectLanguage(i18n, req);
    const userId = req.params.id;

    if (typeof userId === undefined || userId === "") return renderWithNoUser(res);

    try {
        const user = await (new InternalUser(userId)).get();

        return renderWithUser(user, res);
    } catch (err) {
        renderWithNoUser(res);
    }
}