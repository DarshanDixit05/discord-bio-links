// @ts-check

/**
 * @typedef {import('./../types/User.js').User} User
 */


import { TranslationManager } from "../helpers/TranslationManager.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { getCountryFlagFor } from "../helpers/getCountryFlagFor.js";
import { renderMarkdown } from "../helpers/renderMarkdown.js";
import { request } from "../helpers/request.js";
import { isUser } from "../types/User.js";

/**
 * Fetches the user with the ID specified in the URL.
 * @returns {Promise<User|null>}
 */
async function getUser() {
    const userId = window.location.pathname.split("/view/")[1];

    try {
        const res = await request({
            method: "GET",
            url: "/api/users",
            headers: {
                id: userId
            },
            body: undefined
        });

        if (!isUser(res.user)) throw new Error();
        return res.user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * Creates and adds the event listener for the "Toggle raw view on/off" button.
 */
function loadRawToggler() {
    let isRawViewOn = false;

    async function mini() {
        isRawViewOn = !isRawViewOn;

        const rawViewToggler = document.getElementById("toggle-raw-view");
        const rawDisplay = document.getElementById("raw-biography-text");
        const formattedDisplay = document.getElementById("formatted-biography-text");

        if (rawViewToggler && rawDisplay && formattedDisplay) {
            if (!isRawViewOn) {
                const translation = await TranslationManager.fetchTranslation("turn raw view on", "view");
                if (translation) rawViewToggler.innerText = translation.translation;

                rawDisplay.style.display = "none";
                formattedDisplay.style.display = "block";
            } else {
                const translation = await TranslationManager.fetchTranslation("turn raw view off", "view");
                if (translation) rawViewToggler.innerText = translation.translation;

                rawDisplay.style.display = "block";
                formattedDisplay.style.display = "none";
            }
        }
    }

    const rawViewToggler = document.getElementById("toggle-raw-view");
    if (rawViewToggler) rawViewToggler.addEventListener("click", mini);
}

/**
 * Loads the language controllers that will affect which biography is displayed.
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

                if (controls) {
                    for (const child of controls.children) {
                        child.className = `lang-control small-button`;
                    }
                }

                button.className = `lang-control small-button current-flang`;

                const rawDisplay = document.getElementById("raw-biography-text");
                const formattedDisplay = document.getElementById("formatted-biography-text");

                if (formattedDisplay && rawDisplay && rawDisplay instanceof HTMLTextAreaElement) {
                    rawDisplay.value = user.biographies[focusLang].text;
                    renderMarkdown(formattedDisplay, user.biographies[focusLang].text, 1);
                }
            });

            controls.appendChild(button);
        }
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    let focusLang = "us";
    const user = await getUser();

    if (!user) {
        const translation = await TranslationManager.fetchTranslation("user not found", "errors");
        if (translation) displayMessage(translation.translation, "fatal");
        return;
    }

    loadLanguageControls(user, focusLang);
    loadRawToggler();
});