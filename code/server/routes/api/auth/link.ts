import express, { Router } from "express";
import { LoginAttemptManager } from "../../../../structures/LoginAttemptManager.js";
import { createAuthUrl } from "../../../../helpers/createAuthUrl.js";
import { cfg } from "../../../../config.js";
import { CodifiedError } from "../../../../structures/CodifiedError.js";

const router = Router();

router.get("/api/auth/link", async function (req, res) {
    try {
        const loginAttempt = await LoginAttemptManager.addAttempt();
        const authUrl = createAuthUrl(cfg.client.redirectUri, loginAttempt.state, ["identify"]);

        res.json({
            authUrl,
            loginAttempt
        });
    } catch (err) {
        res.status(500).json(new CodifiedError("INTERNAL_UNEXPECTED_EXCEPTION"));
    }
});

export default router;