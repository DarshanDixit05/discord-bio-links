// @ts-check
import { TranslationManager } from "../helpers/TranslationManager.js";
import { renderMarkdown } from "../helpers/renderMarkdown.js";
import { getCountryFlagFor } from "../helpers/getCountryFlagFor.js";
import { request } from "../helpers/request.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { fetchLoggedInUser } from "../helpers/fetchLoggedInUser.js";
import { FocusLangManager } from "../helpers/focusLangManager.js";
import { clearCookie } from "../helpers/clearCookie.js";

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
            } else if (err.status === 401 || err.status === 440 || err.status === 404) {
                clearCookie("session");
                const translation = await TranslationManager.fetchTranslation("session expired", "errors");
                if (translation) return displayMessage(translation.translation, "error");
            } else if (err.status === 400) {
                const translation = await TranslationManager.fetchTranslation("invalid request", "errors");
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
 * Renders the Markdown preview inside the preview box.
 */
function displayPreview() {
    const previewDiv = document.getElementById("preview");
    const input = document.getElementById("biography-input");
    if (input && input instanceof HTMLTextAreaElement && previewDiv) renderMarkdown(previewDiv, input.value.trim())
};

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

                displayPreview();
                input.addEventListener("input", displayPreview);
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
 */
function loadLanguageControls(user) {
    const controls = document.getElementById("controls");
    const languageCodes = Object.keys(user.biographies).map(k => k.toLowerCase());

    if (controls) {
        for (const code of languageCodes) {
            const flag = getCountryFlagFor(code);

            const button = document.createElement("button");
            button.innerText = flag;
            button.className = `lang-control small-button`;

            if (code === FocusLangManager.getFocusLang()) button.className = `lang-control small-button current-flang`;

            button.addEventListener("click", function () {
                const oldFocusLang = FocusLangManager.getFocusLang();

                if (code === "us") console.log(`🇺🇸🦅🇺🇸🦅🇺🇸🦅 WHAT THE FUCK IS A KILOMETER?`);
                if (code === "fr") console.log(`🇫🇷🥖🇫🇷🥖🇫🇷🥖 Oh mon dieu, les gens qui parlent le français, ils ont tellement de charisme!`);

                FocusLangManager.setFocusLang(code);

                const bioInput = document.getElementById("biography-input");
                const controls = document.getElementById("controls");

                if (controls) {
                    for (const child of controls.children) {
                        child.className = `lang-control small-button`;
                    }
                }

                button.className = `lang-control small-button current-flang`;

                if (bioInput && bioInput instanceof HTMLTextAreaElement) {
                    sessionStorage.setItem(`bio-${oldFocusLang}`, bioInput.value);
                    bioInput.value = sessionStorage.getItem(`bio-${code}`) || user.biographies[code].text;
                }

                displayPreview();
                sendButtonDisabler(user);
            });

            controls.appendChild(button);
        }
    }
}

/**
 * Creates and adds the event listener for the "Edit biography" button.
 * @param {User} user 
 */
function setupSendButton(user) {
    const input = document.getElementById("biography-input");
    if (input && input instanceof HTMLTextAreaElement) input.addEventListener("input", () => sendButtonDisabler(user));

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
                    [FocusLangManager.getFocusLang()]: {
                        text: input.value
                    }
                };

                Object.assign(user.biographies, edited);

                for (const lang of Object.keys(user.biographies)) sessionStorage.removeItem(`bio-${lang}`);

                const req = await request({
                    method: "POST",
                    url: "/api/users/bios",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: user.biographies
                }).catch(err => handleRequestError(err));

                user = req.user;
                sendButtonDisabler(user);

                const translation = await TranslationManager.fetchTranslation("bio modified", "index");
                if (translation) displayMessage(translation.translation, "success");
            }
        });
    }
}

/**
 * Controls whether or not the send button should be disabled or not.
 * @param {User} user
 */
function sendButtonDisabler(user) {
    const button = document.getElementById("send-button");
    const input = document.getElementById("biography-input");

    if (input && button && input instanceof HTMLTextAreaElement && button instanceof HTMLButtonElement) {
        if (input.value.trim() === "" || input.value.trim() === user.biographies[FocusLangManager.getFocusLang()].text.trim()) return button.disabled = true;
        button.disabled = false;
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    const previewSection = document.getElementById("preview-section");
    if (previewSection) previewSection.style.display = "none";

    let user = await fetchLoggedInUser();
    FocusLangManager.setFocusLang("us");

    loadLanguageControls(user);
    loadPreviewToggler();
    setupSendButton(user);
    sendButtonDisabler(user);
});