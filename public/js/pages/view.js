// @ts-check

/**
 * @typedef {import('./../types/User.js').User} User
 */


import { TranslationManager } from "../helpers/TranslationManager.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { FocusLangManager } from "../helpers/focusLangManager.js";
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

        if (!isUser(res.user)) throw new Error("error while fetching");

        return res.user;
    } catch (err) {
        console.error(err);
        const translation = await TranslationManager.fetchTranslation("user not found", "errors");
        if (translation) displayMessage(translation.translation, "error");
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
 * Displays the user's biography.
 * @param {User} user
 */
function displayBio(user) {
    const rawDisplay = document.getElementById("raw-biography-text");
    const formattedDisplay = document.getElementById("formatted-biography-text");

    if (formattedDisplay && rawDisplay && rawDisplay instanceof HTMLTextAreaElement) {
        rawDisplay.value = user.biographies[FocusLangManager.getFocusLang()].text;
        renderMarkdown(formattedDisplay, user.biographies[FocusLangManager.getFocusLang()].text, 1);
        adjustRawDisplayHeight();
    }
}

/**
 * Loads the language controllers that will affect which biography is displayed.
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
                if (code === "us") console.log(`🇺🇸🦅🇺🇸🦅🇺🇸🦅 WHAT THE FUCK IS A KILOMETER?`);
                if (code === "fr") console.log(`🇫🇷🥖🇫🇷🥖🇫🇷🥖 Oh mon dieu, les gens qui parlent le français, ils ont tellement de charisme!`);

                FocusLangManager.setFocusLang(code);

                if (controls) {
                    for (const child of controls.children) {
                        child.className = `lang-control small-button`;
                    }
                }

                button.className = `lang-control small-button current-flang`;

                displayBio(user);
            });

            controls.appendChild(button);
        }
    }
}

function adjustRawDisplayHeight() {
    const rawDisplay = document.getElementById("raw-biography-text");
    if (rawDisplay) {
        rawDisplay.style.height = "auto";
        rawDisplay.style.height = `${rawDisplay.scrollHeight + 15}px`;
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    const rawBioDisplay = document.getElementById("raw-biography-text");
    if (rawBioDisplay) rawBioDisplay.style.display = "none";

    FocusLangManager.setFocusLang("us");
    const user = await getUser();

    if (!user) {
        const translation = await TranslationManager.fetchTranslation("user not found", "errors");
        if (translation) displayMessage(translation.translation, "fatal");
        return;
    }

    loadLanguageControls(user);
    loadRawToggler();

    displayBio(user);
});