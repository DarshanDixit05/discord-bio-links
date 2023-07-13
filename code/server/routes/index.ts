import { Router } from "express";
import { join, resolve } from "path";
import Backend from "i18next-fs-backend";
import { cfg } from "../../config.js";
import { getSupportedMostPreferredLanguage } from "../../languages.js";
import cookieParser from 'cookie-parser';
import i18next from "i18next";
import { InternalUser } from "../../structures/InternalUser.js";
import { User } from "../../structures/User.js";
import { LoginAttemptManager } from "../../structures/LoginAttemptManager.js";
import { exchangeCodeForAccessToken } from "../../helpers/exchangeCodeForTokenData.js";
import { getPartialDiscordUserData } from "../../helpers/getPartialDiscordUserData.js";
import { SessionToken } from "../../structures/Session.js";
import { createAuthUrl } from "../../helpers/createAuthUrl.js";

const i18n = i18next.createInstance();

await i18n.use(Backend).init({
    fallbackLng: 'us',
    ns: [
        "index",
        "footer",
        "header",
        "common"
    ],
    backend: {
        loadPath: resolve(cfg.directories.public, 'locales/{{lng}}/{{ns}}.json')
    }
});

const translate = i18n.t;

const index = Router();

index.get("/", cookieParser(), async function (req, res, next) {
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
        } else {
            if (req.query.code && req.query.state && req.cookies.tempid && typeof req.query.code === "string" && typeof req.query.state === "string") {
                const stateWasNotModified = await LoginAttemptManager.isStateForIdEqualTo(req.cookies.tempid, req.query.state);

                if (!stateWasNotModified) throw new Error("ALTERED_OAUTH2_STATE");

                const accessTokenResponse = await exchangeCodeForAccessToken(req.query.code, cfg.client.redirectUri);
                const partialDiscordUserData = await getPartialDiscordUserData(accessTokenResponse.access_token, accessTokenResponse.token_type);
                const userExists: boolean = await InternalUser.has(partialDiscordUserData.id);
                const internalUser = new InternalUser(partialDiscordUserData.id);

                if (!userExists) await internalUser.save();

                await internalUser.updateRefreshToken(accessTokenResponse.refresh_token);

                const sessionToken: SessionToken = await internalUser.getNewSession();
                const session = `${partialDiscordUserData.id} ${sessionToken}`;

                try {
                    user = await (new InternalUser(partialDiscordUserData.id)).get();
                } catch (err) {
                    console.error(err);
                }

                const TEN_DAYS_IN_MS = 1 * 1000 * 60 * 60 * 24 * 10;

                res.cookie("session", session, {
                    maxAge: TEN_DAYS_IN_MS
                });
            } else {
                const loginAttempt = await LoginAttemptManager.addAttempt();
                authLink = createAuthUrl(cfg.client.redirectUri, loginAttempt.state, ["identify"]);

                res.cookie("tempid", loginAttempt.id);
            }
        }

        res.render("index.ejs", {
            user,
            lang: mostPreferredSupportedLanguage,
            authLink,
            origin: cfg.client.redirectUri,
            translations: {
                appName: translate("app name", { ns: "common" }),
                catchline: translate("catchline", { ns: "header" }),
                loginButton: translate("login", { ns: "index" }),
                editBioButton: translate("edit bio", { ns: "index" }),
                turnPreviewOn: translate("turn preview on", { ns: "index" }),
                welcomeBack: translate("welcome back", { ns: "index", username: (user === null) ? "" : user.username }),
                copyPasteLink: translate("copy paste link", { ns: "index" }),
                bioPreview: translate("bio preview", { ns: "index" }),
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

export default index;