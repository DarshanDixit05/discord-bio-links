// @ts-check

import { isUser } from "../types/User.js";
import { TranslationManager } from "./TranslationManager.js";
import { clearCookie } from "./clearCookie.js";
import { displayMessage } from "./displayMessage.js";
import { fetchSession } from "./fetchSession.js";
import { request } from "./request.js";

/**
 * @typedef {import("../types/User").User} User
 */

async function forceLogout() {
    clearCookie("session");

    setTimeout(function () {
        window.location.href = "/";
    }, 10_000);

    const translation = await TranslationManager.fetchTranslation("session expired", "errors");
    if (translation) displayMessage(translation.translation, "fatal");
}

/**
 * Handles a request error.
 * @param {any} err
 */
async function handleRequestError(err) {
    console.log(err);

    try {
        if (err instanceof Response) {
            if (err.status === 429) {
                const translation = await TranslationManager.fetchTranslation("rate limited", "errors");
                if (translation) return displayMessage(translation.translation, "fatal");
            } else if (err.status === 400) {
                const translation = await TranslationManager.fetchTranslation("invalid request", "errors");
                if (translation) return displayMessage(translation.translation, "fatal");
            } else if (err.status === 404) {
                clearCookie("session");
                const translation = await TranslationManager.fetchTranslation("session expired", "errors");
                if (translation) return displayMessage(translation.translation, "fatal");
            } else if (err.status === 500) {
                const translation = await TranslationManager.fetchTranslation("unknown", "errors");
                if (translation) return displayMessage(translation.translation, "error");
            }
        }

        const translation = await TranslationManager.fetchTranslation("unknown", "errors");
        if (translation) return displayMessage(translation.translation, "fatal");

        throw new Error();
    } catch (err) {
        console.error(err);
        displayMessage("An unknown fatal error occurred.", "fatal");
    }
}

/**
 * Fetches the user currently logged in.
 * 
 * 
 * If the user is not logged in or their session expired, it will clear the session cookie, display a "fatal" error and force them back to the main page so they can log in again.
 * 
 * @returns {Promise<User>}
 */
export async function fetchLoggedInUser() {
    const session = fetchSession();
    if (session === null) throw new Error("Not logged in yet.");

    const userId = session.split("%20")[0];

    const res = await request({
        method: "GET",
        url: "/api/users",
        headers: {
            id: userId
        },
        body: undefined
    }).catch(err => handleRequestError(err));

    if (!isUser(res.user)) {
        forceLogout();
        throw new Error("Session expired.");
    }

    return res.user;
}