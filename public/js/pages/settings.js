// @ts-check
import { TranslationManager } from "../helpers/TranslationManager.js";
import { clearCookie } from "../helpers/clearCookie.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { fetchSession } from "../helpers/fetchSession.js";
import { request } from "../helpers/request.js";
import { isUser } from "../types/User.js";
import { confirm } from "../helpers/confirm.js";

/**
 * @typedef {import("../types/User.js").User} User
 */

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

function setupLogoutButton() {
    const logout = document.getElementById("logout");

    if (logout) {
        logout.addEventListener("click", async function () {
            const res = await request({
                url: "/api/users/revoke",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: {}
            }).catch(err => handleRequestError(err));

            // aka, the res body is empty
            if (Object.keys(res).length === 0) {
                const translation = await TranslationManager.fetchTranslation("logged out", "settings");
                if (translation) displayMessage(translation.translation, "success");
            }
        });
    }
}

function setupDeleteButton() {
    async function deleteAcc() {
        const res = await request({
            url: "/api/users",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: {}
        }).catch(err => handleRequestError(err));

        // aka, the res body is empty
        if (Object.keys(res).length === 0) {
            const translation = await TranslationManager.fetchTranslation("deleted", "settings");
            if (translation) displayMessage(translation.translation, "success");
        }
    }

    const deleteButton = document.getElementById("delete");

    if (deleteButton) {
        deleteButton.addEventListener("click", async function () {
            const confirmationTranslation = await TranslationManager.fetchTranslation("confirm delete", "settings");
            const yesTranslation = await TranslationManager.fetchTranslation("yes", "common");
            const noTranslation = await TranslationManager.fetchTranslation("no", "common");

            if (confirmationTranslation && yesTranslation && noTranslation) {
                confirm(
                    confirmationTranslation.translation,
                    yesTranslation.translation,
                    noTranslation.translation,
                    deleteAcc,
                    () => null
                );
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    setupLogoutButton();
    setupDeleteButton();
});