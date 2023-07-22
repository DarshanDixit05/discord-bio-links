import express, { Router } from "express";
import { LoginAttemptManager } from "../../../../structures/LoginAttemptManager.js";
import { createAuthUrl } from "../../../../helpers/createAuthUrl.js";
import { cfg } from "../../../../config.js";
const getLink = Router();

getLink.get("/", async function (req, res, next) {
    try {
        const loginAttempt = await LoginAttemptManager.addAttempt();
        const authUrl = createAuthUrl(cfg.client.redirectUri, loginAttempt.state, ["identify"]);

        res.json({
            authUrl,
            loginAttempt
        });
    } catch (err) {
        next(err);
    }
});

export default getLink; 