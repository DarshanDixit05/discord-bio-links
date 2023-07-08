//@ts-check

import { getSupportedLanguageFor, getTextForLanguage } from "../languages.js";

const langConfig = getSupportedLanguageFor(document.documentElement.lang);

/**
 * 
 * @param {string} message 
 * @param {() => any} ifYes 
 * @param {() => any} ifNo 
 */
export function askConfirmation(message, ifYes, ifNo) {
    const prompt = document.createElement("dialog");
    prompt.className = "prompt";
    prompt.innerText = message;

    const form = document.createElement("form");
    form.method = "dialog";

    const menu = document.createElement("menu");

    const confirmButton = document.createElement("button");
    confirmButton.value = "yes";
    confirmButton.className = "confirm";
    confirmButton.innerText = getTextForLanguage(langConfig, "confirm");
    confirmButton.onclick = ifYes;
    confirmButton.disabled = true;

    const cancelButton = document.createElement("button");
    cancelButton.value = "no";
    cancelButton.className = "cancel";
    cancelButton.innerText = getTextForLanguage(langConfig, "cancel");
    cancelButton.onclick = ifNo;
    cancelButton.disabled = true;

    setTimeout(() => {
        confirmButton.disabled = false;
        cancelButton.disabled = false;
    }, 5_000);

    menu.appendChild(confirmButton);
    menu.appendChild(cancelButton);

    form.appendChild(menu);
    prompt.appendChild(form);

    document.body.appendChild(prompt);
    prompt.open = true;
}