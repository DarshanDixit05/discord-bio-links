import express, { Router } from "express";
import { LoginAttemptManager } from "../../../../structures/LoginAttemptManager.js";
import { createAuthUrl } from "../../../../helpers/createAuthUrl.js";
import { cfg } from "../../../../config.js";
import { exchangeCodeForAccessToken } from "../../../../helpers/exchangeCodeForTokenData.js";
import { getPartialDiscordUserData } from "../../../../helpers/getPartialDiscordUserData.js";
import { InternalUser } from "../../../../structures/InternalUser.js";
import { SessionToken } from "../../../../structures/Session.js";
import { isLoginWithCodeRequest } from "../../../../structures/requests/LoginWithCodeRequest.js";
import getLink from "./link.js";

const login = Router();

login.post("/", async function (req, res, next) {
    try {
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

        const sessionToken: SessionToken = await internalUser.getNewSession();
        const session = `${partialDiscordUserData.id} ${sessionToken}`;

        res.json({ session });
    } catch (err) {
        next(err);
    }
});

login.use("/link", getLink);

export default login;