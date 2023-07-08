import express, { Router } from "express";
import { LoginAttemptManager } from "../../../../structures/LoginAttemptManager.js";
import { createAuthUrl } from "../../../../helpers/createAuthUrl.js";
import { cfg } from "../../../../config.js";
import { replyToRequestWithError } from "../../../../helpers/replyToRequestWithError.js";
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
        replyToRequestWithError({
            res,
            httpCode: 500,
            errorCode: "UNEXPECTED_INTERNAL_EXCEPTION",
            errorMessage: "An unexpected error occurred."
        });
    }
});

export default router;