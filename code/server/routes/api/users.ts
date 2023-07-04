import express, { Router } from "express";
import { isLoginWithCodeRequest } from "../../../structures/requests/LoginWithCodeRequest.js";
import { LoginAttemptManager } from "../../../structures/LoginAttemptManager.js";
import { InternalUser } from "../../../structures/InternalUser.js";
import { exchangeCodeForAccessToken } from "../../../helpers/exchangeCodeForTokenData.js";
import { cfg } from "../../../config.js";
import { getPartialDiscordUserData } from "../../../helpers/getPartialDiscordUserData.js";
import { Session } from "../../../structures/Session.js";
import { CodifiedError } from "../../../structures/CodifiedError.js";
import { isUserLookupRequest } from "../../../structures/requests/UserLookupRequest.js";
import { User } from "../../../structures/User.js";
import { isBiography } from "../../../structures/Biography.js";

const router = Router();

router.get("/api/users", async function (req, res) {
    try {
        if (isUserLookupRequest(req.headers)) {
            try {
                const user: User = await (new InternalUser(req.headers.id)).get();
                res.json({ user });
            } catch (err) {
                if (err instanceof CodifiedError) {
                    if (err.code === "UNKNOWN_INTERNAL_USER") {
                        res.status(404);
                    } else res.status(500).json(err);
                } else res.status(500).json(err);
            }
        } else res.status(400).json(new CodifiedError("INVALID_REQUESTS_HEADERS"));
    } catch (err) {
        console.error(err);
        res.status(500).json(new CodifiedError("INTERNAL_UNEXPECTED_EXCEPTION"));
    }
});

router.post("/api/users", async function (req, res) {
    try {
        if ("authorization" in req.headers && "id" in req.headers) {
            if (typeof req.headers.authorization === "string" && typeof req.headers.id === "string" && isBiography(req.body)) {
                try {
                    const internalUser = new InternalUser(req.headers.id);
                    await internalUser.editBio(req.body);
                    res.sendStatus(200);
                } catch (err) {
                    if (err instanceof CodifiedError) {
                        if (err.code === "UNKNOWN_INTERNAL_USER") {
                            res.status(404);
                        } else res.status(500).json(err);
                    } else res.status(500).json(err);
                }
            } else res.status(400);
        } else res.status(401);
    } catch (err) {
        console.error(err);
        res.status(500).json(new CodifiedError("INTERNAL_UNEXPECTED_EXCEPTION"));
    }
})

router.put("/api/users", async function (req, res) {
    try {
        if (isLoginWithCodeRequest(req.headers)) {
            const { state, id, code } = req.headers;

            const stateWasNotModified = await LoginAttemptManager.isStateForIdEqualTo(id, state);

            if (stateWasNotModified) {
                try {
                    const accessTokenResponse = await exchangeCodeForAccessToken(code, cfg.client.redirectUri);
                    const partialDiscordUserData = await getPartialDiscordUserData(accessTokenResponse.access_token, accessTokenResponse.token_type);

                    const internalUser = new InternalUser(partialDiscordUserData.id);
                    await internalUser.updateRefreshToken(accessTokenResponse.refresh_token);

                    const session: Session = await internalUser.getNewSession();

                    res.json({ session });
                } catch (err) {
                    res.status(500).json(err);
                }
            } else res.status(403).json(new CodifiedError("ALTERED_OAUTH2_STATE"));
        } else res.status(400).json(new CodifiedError("INVALID_REQUESTS_HEADERS"));
    } catch (err) {
        console.error(err);
        res.status(500).json(new CodifiedError("INTERNAL_UNEXPECTED_EXCEPTION"));
    }
});

export default router;