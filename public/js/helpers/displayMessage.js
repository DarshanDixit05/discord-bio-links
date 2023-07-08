import { getTextForLanguage, getSupportedLanguageFor } from "../languages.js";

// @ts-check
const langConfig = getSupportedLanguageFor(document.documentElement.lang);
const messages = [];

/**
 * 
 * @param {string} message 
 * @param {"success" | "neutral" | "error" | "fatal"} type
 * @param {boolean} permanent
 */
export function displayMessage(message, type, permanent = false) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    if (type === "fatal") {
        localStorage.clear();

        document.documentElement.innerHTML =
            `<div id="message" style="display: block; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${message}\n<a href="/">${getTextForLanguage(langConfig, "backToMainPage")}</a></div>`;

        return document.getElementById("message");
    } else {
        const messageBox = document.createElement("div");
        messageBox.innerText = message;
        messageBox.className = `message message-${type}`;

        for (const message of messages) {
            // Who cares about catching errors?
            try { document.body.removeChild(message) } catch (err) { }
        };

        document.body.appendChild(messageBox);
        messages.push(messageBox);

        if (!permanent) {
            setTimeout(() => {
                messageBox.style.opacity = "0";
                setTimeout(() => {
                    try { document.body.removeChild(messageBox) } catch (err) { }
                }, 3_000);
            }, 7_500);
        }

        return messageBox;
    }
}