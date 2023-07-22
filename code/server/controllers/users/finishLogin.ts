import { NextFunction, Request, Response } from "express";
import { cfg } from "../../../config.js";
import { exchangeCodeForAccessToken } from "../../../helpers/exchangeCodeForTokenData.js";
import { getPartialDiscordUserData } from "../../../helpers/getPartialDiscordUserData.js";
import { InternalUser } from "../../../structures/InternalUser.js";
import { LoginAttemptManager } from "../../../structures/LoginAttemptManager.js";
import { SessionToken } from "../../../structures/Session.js";

function validateData(obj: unknown): obj is { state: string, tempid: string, code: string } {
    if (obj !== null && typeof obj === "object") {
        if (
            "state" in obj && typeof obj.state === "string" &&
            "tempid" in obj && typeof obj.tempid === "string" &&
            "code" in obj && typeof obj.code === "string"
        ) return true;
    }
    return false;
}

export async function finishLogin(req: Request, res: Response, next: NextFunction) {
    try {
        if (!validateData(req.headers)) throw new Error("INVALID_REQUEST");
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
}