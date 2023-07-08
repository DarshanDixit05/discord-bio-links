import { Router } from "express";
import { isLoginWithCodeRequest } from "../../../structures/requests/LoginWithCodeRequest.js";
import { LoginAttemptManager } from "../../../structures/LoginAttemptManager.js";
import { InternalUser } from "../../../structures/InternalUser.js";
import { exchangeCodeForAccessToken } from "../../../helpers/exchangeCodeForTokenData.js";
import { cfg } from "../../../config.js";
import { getPartialDiscordUserData } from "../../../helpers/getPartialDiscordUserData.js";
import { Session, isSession } from "../../../structures/Session.js";
import { isUserLookupRequest } from "../../../structures/requests/UserLookupRequest.js";
import { User } from "../../../structures/User.js";
import { replyToRequestWithError } from "../../../helpers/replyToRequestWithError.js";
import DOMPurify from 'isomorphic-dompurify';
import { isBiography } from "../../../structures/Biography.js";
import { doRequest } from "../../../helpers/doRequest.js";
import { revokeToken } from "../../../helpers/revokeToken.js";

const router = Router();

router.get("/api/users", async function (req, res) {
    try {
        if (!isUserLookupRequest(req.headers)) throw new Error("INVALID_REQUEST");

        const internalUser = new InternalUser(req.headers.id);
        const user: User = await internalUser.get();

        if (!res.headersSent) res.json({ user });
    } catch (err) {
        console.error(err);

        if (err instanceof Error) {
            if (err.message.includes("INVALID_REQUEST")) {
                replyToRequestWithError({
                    res,
                    httpCode: 400,
                    errorCode: "INVALID_REQUEST",
                    errorMessage: "This request was made with malformed HTTP headers or a malformed body."
                });
            } else if (err.message.includes("UNKNOWN_INTERNAL_USER")) {
                replyToRequestWithError({
                    res,
                    httpCode: 404,
                    errorCode: "UNKNOWN_INTERNAL_USER",
                    errorMessage: "The specified user does not exist."
                });
            } else if (err.message.includes("NOT_A_DISCORD_ID")) {
                replyToRequestWithError({
                    res,
                    httpCode: 422,
                    errorCode: "NOT_A_DISCORD_ID",
                    errorMessage: "The provided ID does not look like a Discord ID."
                });
            } else if (err.message.includes("INVALID_REFRESH_TOKEN")) {
                replyToRequestWithError({
                    res,
                    httpCode: 404,
                    errorCode: "INVALID_REFRESH_TOKEN",
                    errorMessage: "The specified user deauthorized the app, so their data isn't available."
                });
            }
        } else {
            replyToRequestWithError({
                res,
                httpCode: 500,
                errorCode: "UNKNOWN_SERVER_ERROR",
                errorMessage: "An unexpected error occurred."
            });
        }
    }
});

router.post("/api/users", async function (req, res) {
    try {
        let { authorization } = req.headers;
        authorization = JSON.parse(authorization || "null");

        if (!isSession(authorization)) throw new Error("INVALID_REQUEST");

        const internalUser = new InternalUser(authorization.id);
        const correctToken: boolean = await internalUser.sessionTokenIs(authorization.token);
        const validSession: boolean = await internalUser.isSessionValid();

        if (!correctToken) throw new Error("UNAUTHORIZED");
        if (!validSession) throw new Error("EXPIRED_SESSION");

        for (const bio of Object.values(req.body)) {
            if (!isBiography(bio)) throw new Error("INVALID_REQUEST");
            bio.text = DOMPurify.sanitize(bio.text.trim());
        }

        await internalUser.editBios(req.body);

        const user: User = await internalUser.get();
        if (!res.headersSent) res.json({ user });
    } catch (err) {
        console.error(err);

        if (err instanceof Error) {
            if (err instanceof SyntaxError) {
                // SyntaxError is throw when JSON.parse() encounters a value it shouldn't.
                replyToRequestWithError({
                    res,
                    httpCode: 400,
                    errorCode: "INVALID_REQUEST",
                    errorMessage: "This request was made with malformed HTTP headers or a malformed body."
                });
            } else if (err.message.includes("INVALID_REQUEST")) {
                replyToRequestWithError({
                    res,
                    httpCode: 400,
                    errorCode: "INVALID_REQUEST",
                    errorMessage: "This request was made with malformed HTTP headers or a malformed body."
                });
            } else if (err.message.includes("UNKNOWN_INTERNAL_USER")) {
                replyToRequestWithError({
                    res,
                    httpCode: 404,
                    errorCode: "UNKNOWN_INTERNAL_USER",
                    errorMessage: "The specified user does not exist."
                });
            } else if (err.message.includes("UNAUTHORIZED")) {
                replyToRequestWithError({
                    res,
                    httpCode: 401,
                    errorCode: "UNAUTHORIZED",
                    errorMessage: "You are not allowed to perform this action."
                });
            } else if (err.message.includes("NOT_A_DISCORD_ID")) {
                replyToRequestWithError({
                    res,
                    httpCode: 422,
                    errorCode: "NOT_A_DISCORD_ID",
                    errorMessage: "The provided ID does not look like a Discord ID."
                });
            } else if (err.message.includes("EXPIRED_SESSION")) {
                replyToRequestWithError({
                    res,
                    httpCode: 440,
                    errorCode: "EXPIRED_SESSION",
                    errorMessage: "This session expired, please log in again."
                });
            }
        } else {
            replyToRequestWithError({
                res,
                httpCode: 500,
                errorCode: "UNKNOWN_SERVER_ERROR",
                errorMessage: "An unexpected error occurred."
            });
        }
    }
})

router.patch("/api/users", async function (req, res) {
    try {
        const { state, tempid, code } = req.headers;

        if (state === "RESET" && code === "RESET" && tempid === "RESET") {
            let { authorization } = req.headers;
            authorization = JSON.parse(authorization || "null");

            if (!isSession(authorization)) throw new Error("INVALID_REQUEST");

            const internalUser = new InternalUser(authorization.id);

            const correctToken: boolean = await internalUser.sessionTokenIs(authorization.token);
            const validSession: boolean = await internalUser.isSessionValid();

            if (!correctToken) throw new Error("UNAUTHORIZED");
            if (!validSession) throw new Error("EXPIRED_SESSION");

            await internalUser.revokeToken();

            // The session is updated but not sent back.
            await internalUser.getNewSession();

            if (!res.headersSent) res.sendStatus(204);
        } else {
            if (!isLoginWithCodeRequest(req.headers)) throw new Error("INVALID_REQUEST");
            const { state, tempid, code } = req.headers;

            const stateWasNotModified = await LoginAttemptManager.isStateForIdEqualTo(tempid, state);

            if (!stateWasNotModified) throw new Error("ALTERED_OAUTH2_STATE");

            const accessTokenResponse = await exchangeCodeForAccessToken(code, cfg.client.redirectUri);
            const partialDiscordUserData = await getPartialDiscordUserData(accessTokenResponse.access_token, accessTokenResponse.token_type);
            const userExists: boolean = await InternalUser.has(partialDiscordUserData.id);
            const internalUser = new InternalUser(partialDiscordUserData.id);

            if (!userExists) await internalUser.save();

            await internalUser.updateRefreshToken(accessTokenResponse.refresh_token);

            const session: Session = await internalUser.getNewSession();

            res.json({ session });
        }
    } catch (err) {
        console.error(err);

        if (err instanceof Error) {
            if (err.message.includes("INVALID_REQUEST")) {
                replyToRequestWithError({
                    res,
                    httpCode: 400,
                    errorCode: "INVALID_REQUEST",
                    errorMessage: "This request was made with malformed HTTP headers or a malformed body."
                });
            } else if (err.message.includes("UNAUTHORIZED")) {
                replyToRequestWithError({
                    res,
                    httpCode: 401,
                    errorCode: "UNAUTHORIZED",
                    errorMessage: "You are not allowed to perform this action."
                });
            } else if (err.message.includes("EXPIRED_SESSION")) {
                replyToRequestWithError({
                    res,
                    httpCode: 440,
                    errorCode: "EXPIRED_SESSION",
                    errorMessage: "This session expired, please log in again."
                });
            } else if (err.message.includes("ALTERED_OAUTH2_STATE")) {
                replyToRequestWithError({
                    res,
                    httpCode: 403,
                    errorCode: "ALTERED_OAUTH2_STATE",
                    errorMessage: "The OAuth2 state was altered; the request likely was tampered by a CSRF attack. Try again."
                });
            } else if (err.message.includes("INVALID_CODE_FOR_ACCESS_TOKEN_EXCHANGE")) {
                replyToRequestWithError({
                    res,
                    httpCode: 422,
                    errorCode: "INVALID_CODE_FOR_ACCESS_TOKEN_EXCHANGE",
                    errorMessage: "The provided code could not be exchanged for an access token."
                });
            }
        } else {
            replyToRequestWithError({
                res,
                httpCode: 500,
                errorCode: "UNKNOWN_SERVER_ERROR",
                errorMessage: "An unexpected error occurred."
            });
        }
    }
});

router.delete("/api/users", async function (req, res) {
    try {
        let { authorization } = req.headers;
        authorization = JSON.parse(authorization || "null");

        if (!isSession(authorization)) throw new Error("INVALID_REQUEST");

        const internalUser = new InternalUser(authorization.id);

        const correctToken: boolean = await internalUser.sessionTokenIs(authorization.token);
        const validSession: boolean = await internalUser.isSessionValid();

        if (!correctToken) throw new Error("UNAUTHORIZED");
        if (!validSession) throw new Error("EXPIRED_SESSION");

        await internalUser.revokeToken();
        await internalUser.delete();

        if (!res.headersSent) res.sendStatus(204);
    } catch (err) {
        if (err instanceof Error) {
            if (err.message.includes("INVALID_REQUEST")) {
                replyToRequestWithError({
                    res,
                    httpCode: 400,
                    errorCode: "INVALID_REQUEST",
                    errorMessage: "This request was made with malformed HTTP headers or a malformed body."
                });
            } else if (err.message.includes("UNAUTHORIZED")) {
                replyToRequestWithError({
                    res,
                    httpCode: 401,
                    errorCode: "UNAUTHORIZED",
                    errorMessage: "You are not allowed to perform this action."
                });
            } else if (err.message.includes("EXPIRED_SESSION")) {
                replyToRequestWithError({
                    res,
                    httpCode: 440,
                    errorCode: "EXPIRED_SESSION",
                    errorMessage: "This session expired, please log in again."
                });
            }
        } else {
            replyToRequestWithError({
                res,
                httpCode: 500,
                errorCode: "UNKNOWN_SERVER_ERROR",
                errorMessage: "An unexpected error occurred."
            });
        }
    }
});

export default router;