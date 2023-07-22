import { NextFunction, Request, Response } from "express";
import { cfg } from "../../../config.js";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { getSupportedMostPreferredLanguage } from "../../../languages.js";
import { User } from "../../../structures/User.js";
import { createAuthUrl } from "../../../helpers/createAuthUrl.js";
import { exchangeCodeForAccessToken } from "../../../helpers/exchangeCodeForTokenData.js";
import { getPartialDiscordUserData } from "../../../helpers/getPartialDiscordUserData.js";
import { InternalUser } from "../../../structures/InternalUser.js";
import { LoginAttemptManager } from "../../../structures/LoginAttemptManager.js";
import { SessionToken } from "../../../structures/Session.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { prepareI18n } from "../../../helpers/prepareI18n.js";
import { changeI18nToCorrectLanguage } from "../../../helpers/changeI18nToCorrectLanguage.js";

const i18n = i18next.createInstance();

await prepareI18n(i18n, [
    "index",
    "footer",
    "header",
    "common"
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
        appName: translate("app name", { ns: "common" }),
        loginButton: translate("login", { ns: "index" }),
        editBioButton: translate("edit bio", { ns: "index" }),
        turnPreviewOn: translate("turn preview on", { ns: "index" }),
        welcomeBack: translate("welcome back", { ns: "index", username: (user === null) ? "" : user.username }),
        copyPasteLink: translate("copy paste link", { ns: "index" }),
        bioPreview: translate("bio preview", { ns: "index" })
    };
}

async function renderWithAuthLink(req: Request, res: Response, next: NextFunction) {
    try {
        const loginAttempt = await LoginAttemptManager.addAttempt();
        const authLink = createAuthUrl(cfg.client.redirectUri, loginAttempt.state, ["identify"]);

        res.cookie("tempid", loginAttempt.id);

        res.render("index.ejs", {
            user: null,
            translations: translations(),
            lang: i18n.language,
            origin: cfg.client.redirectUri,
            authLink
        });
    } catch (err) {
        next(err);
    }
}

function validateLoginData(obj: unknown): obj is { code: string, state: string } {
    if (obj !== null && typeof obj === "object") {
        if (
            "state" in obj && typeof obj.state === "string" &&
            "code" in obj && typeof obj.code === "string"
        ) return true;
    }
    return false;
}

async function finishLoginThenRender(req: Request, res: Response, next: NextFunction) {
    const { tempid } = req.cookies;

    if (typeof tempid !== "string" || !validateLoginData(req.query)) throw new Error("INVALID_REQUEST");

    const { code, state } = req.query;

    const stateWasNotModified = await LoginAttemptManager.isStateForIdEqualTo(tempid, state);

    if (!stateWasNotModified) throw new Error("ALTERED_OAUTH2_STATE");

    const accessTokenResponse = await exchangeCodeForAccessToken(code, cfg.client.redirectUri);
    const partialDiscordUserData = await getPartialDiscordUserData(accessTokenResponse.access_token, accessTokenResponse.token_type);
    const userExists: boolean = await InternalUser.has(partialDiscordUserData.id);
    const internalUser = new InternalUser(partialDiscordUserData.id);

    if (!userExists) await internalUser.save();

    await internalUser.updateRefreshToken(accessTokenResponse.refresh_token);

    const sessionToken: SessionToken = await internalUser.getNewSession();
    const session = `${partialDiscordUserData.id} ${sessionToken}`;

    const user = await (new InternalUser(partialDiscordUserData.id)).get();

    const TEN_DAYS_IN_MS = 1 * 1000 * 60 * 60 * 24 * 10;

    res.cookie("session", session, {
        maxAge: TEN_DAYS_IN_MS
    });

    res.render("index.ejs", {
        translations: translations(user),
        lang: i18n.language,
        origin: cfg.client.redirectUri,
        user
    });
}

async function renderWithLoggedInUser(req: Request, res: Response, next: NextFunction) {
    await changeI18nToCorrectLanguage(i18n, req);

    if (typeof req.cookies.session !== "string") throw new Error("INVALID_REQUEST");

    const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));
    const user = await (new InternalUser(userId)).get();

    res.render("index.ejs", {
        translations: translations(user),
        lang: i18n.language,
        origin: cfg.client.redirectUri,
        user
    });
}

export async function serveIndexPage(req: Request, res: Response, next: NextFunction) {
    try {
        await changeI18nToCorrectLanguage(i18n, req);

        if (typeof req.cookies.session === "string" && req.cookies.session !== "") {
            await renderWithLoggedInUser(req, res, next);
            return;
        }

        if (Object.values(req.query).length > 0) {
            await finishLoginThenRender(req, res, next);
            return;
        }

        renderWithAuthLink(req, res, next);
    } catch (err) {
        res.cookie("session", "");
        renderWithAuthLink(req, res, next);
    }
}