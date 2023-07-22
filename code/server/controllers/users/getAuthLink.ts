import { NextFunction, Request, Response } from "express";
import { cfg } from "../../../config.js";
import { createAuthUrl } from "../../../helpers/createAuthUrl.js";
import { LoginAttemptManager } from "../../../structures/LoginAttemptManager.js";

export async function getAuthLink(req: Request, res: Response, next: NextFunction) {
    try {
        const loginAttempt = await LoginAttemptManager.addAttempt();
        const authUrl = createAuthUrl(cfg.client.redirectUri, loginAttempt.state, ["identify"]);

        res.json({ authUrl, loginAttempt });
    } catch (err) {
        next(err);
    }
};