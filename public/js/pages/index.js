// @ts-check
import { TranslationManager } from "../helpers/TranslationManager.js";
import { renderMarkdown } from "../helpers/renderMarkdown.js";
import { getCountryFlagFor } from "../helpers/getCountryFlagFor.js";
import { request } from "../helpers/request.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { fetchLoggedInUser } from "../helpers/fetchLoggedInUser.js";

/**
* @typedef {import('./../types/User.js').User} User
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

/**
 * Creates and adds the event listener for the "Toggle preview on/off" button.
 */
function loadPreviewToggler() {
    let isPreviewOn = false;

    async function mini() {
        const previewToggler = document.getElementById("toggle-preview");
        const input = document.getElementById("biography-input");
        const previewSection = document.getElementById("preview-section");

        if (previewToggler && input && input instanceof HTMLTextAreaElement && previewSection) {
            input.value = input.value.trim();
            isPreviewOn = !isPreviewOn;

            if (isPreviewOn) {
                const translation = await TranslationManager.fetchTranslation("turn preview off", "index");
                if (translation) previewToggler.innerText = translation.translation;

                previewSection.style.display = "block";

                function displayPreview() {
                    const previewDiv = document.getElementById("preview");
                    const input = document.getElementById("biography-input");
                    if (input && input instanceof HTMLTextAreaElement && previewDiv) renderMarkdown(previewDiv, input.value.trim(), 2)
                };

                displayPreview();
                input.oninput = displayPreview;
            } else {
                const translation = await TranslationManager.fetchTranslation("turn preview on", "index");
                if (translation) previewToggler.innerText = translation.translation;

                previewSection.style.display = "none";
            }
        }

    }

    const previewToggler = document.getElementById("toggle-preview");
    if (previewToggler) previewToggler.addEventListener("click", mini);
}

/**
 * Loads the language controllers that will affect which biography is displayed and which biography is edited.
 * @param {User} user
 * @param {string} focusLang
 */
function loadLanguageControls(user, focusLang) {
    const controls = document.getElementById("controls");
    const languageCodes = Object.keys(user.biographies).map(k => k.toLowerCase());

    if (controls) {
        focusLang = languageCodes[0];

        for (const code of languageCodes) {
            const flag = getCountryFlagFor(code);

            const button = document.createElement("button");
            button.innerText = flag;
            button.className = `lang-control small-button`;

            if (code === focusLang) button.className = `lang-control small-button current-flang`;

            button.addEventListener("click", function () {
                if (code === "us") console.log(`🇺🇸🦅🇺🇸🦅🇺🇸🦅 WHAT THE FUCK IS A KILOMETER?`);
                if (code === "fr") console.log(`🇫🇷🥖🇫🇷🥖🇫🇷🥖 Oh mon dieu, les gens qui parlent le français, ils ont tellement de charisme!`);

                focusLang = code;

                const bioInput = document.getElementById("biography-input");
                const controls = document.getElementById("controls");

                if (controls) {
                    for (const child of controls.children) {
                        child.className = `lang-control small-button`;
                    }
                }

                button.className = `lang-control small-button current-flang`;

                if (bioInput && bioInput instanceof HTMLTextAreaElement) bioInput.value = user.biographies[code].text;
            });

            controls.appendChild(button);
        }
    }
}

/**
 * Creates and adds the event listener for the "Edit biography" button.
 * @param {User} user 
 * @param {string} focusLang
 */
function setupSendButton(user, focusLang) {
    const button = document.getElementById("send-button");

    if (button) {
        button.addEventListener("click", async function () {
            const input = document.getElementById("biography-input");

            if (input && input instanceof HTMLTextAreaElement) {
                if (input.value.trim() === "") {
                    const translation = await TranslationManager.fetchTranslation("enter some text", "errors");
                    if (translation) displayMessage(translation.translation, "error");
                    return;
                }

                const edited = {
                    [focusLang]: {
                        text: input.value
                    }
                };

                Object.assign(user.biographies, edited);

                const req = await request({
                    method: "POST",
                    url: "/api/auth/users",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: user.biographies
                }).catch(err => handleRequestError(err));

                user = req.user;

                const translation = await TranslationManager.fetchTranslation("bio modified", "index");
                if (translation) displayMessage(translation.translation, "success");
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    let user = await fetchLoggedInUser();
    let focusLang = "us";

    loadLanguageControls(user, focusLang);
    loadPreviewToggler();
    setupSendButton(user, focusLang);
});