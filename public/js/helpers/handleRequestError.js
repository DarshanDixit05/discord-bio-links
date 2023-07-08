// @ts-check
import { getTextForLanguage } from "../languages.js";
import { displayMessage } from "./displayMessage.js";

export async function handleRequestError(response, langConfig) {
    const { code, message } = await response.json();

    if (code === "INVALID_REQUEST") {
        displayMessage(getTextForLanguage(langConfig, "invalidRequest"), "error");
    } else if (code === "UNKNOWN_INTERNAL_USER") {
        displayMessage(getTextForLanguage(langConfig, "unknownInternalUser"), "error");
    } else if (code === "INVALID_REFRESH_TOKEN") {
        displayMessage(getTextForLanguage(langConfig, "invalidRefreshToken"), "error");
    } else if (code === "NOT_A_DISCORD_ID") {
        displayMessage(getTextForLanguage(langConfig, "notADiscordId"), "fatal", true);
    } else if (code === "RATE_LIMITED") {
        let retryAfter = response.headers.get("Retry-After");
        const rateLimitDisplay = displayMessage(getTextForLanguage(langConfig, "tooManyRequests", [retryAfter]), "fatal", true);

        if (rateLimitDisplay) {
            setInterval(() => {
                retryAfter--;
                rateLimitDisplay.innerText = getTextForLanguage(langConfig, "tooManyRequests", [retryAfter])
            }, 1000);
        }
    } else {
        displayMessage(getTextForLanguage(langConfig, "unexpectedError", [code, message]), "error");
        console.error(`An error occured with the following message: ${message}.\nServer response:`, response);
    }
}