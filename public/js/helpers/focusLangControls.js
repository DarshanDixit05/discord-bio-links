import { getCountryFlagFor } from "./getCountryFlagFor.js";
import { getSupportedLanguageFor } from "../languages.js"

export function getFocusLang() {
    return getSupportedLanguageFor(localStorage.getItem("flang") || "us");
}

/**
 * @param {HTMLElement} element
 * @param {(e: Event) => any} customEventHandler
 * @param  {...string} langCodes 
 */
export function renderLangControls(element, customEventHandler, ...langCodes) {
    const currentFLang = getFocusLang();

    for (const code of langCodes) {
        const flag = getCountryFlagFor(code);
        const control = document.createElement("button");

        control.className = "small-button lang-control ";
        control.innerText = flag;

        if (code === currentFLang) control.className += "current-flang";

        control.onclick = async function () {
            localStorage.setItem("flang", code);

            for (const child of element.children) {
                if (child.className.includes("lang-control")) child.className = "small-button lang-control";
            }

            control.className = "small-button lang-control current-flang";

            await customEventHandler();
        };

        element.appendChild(control);
    }
}