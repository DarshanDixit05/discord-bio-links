//@ts-check
import { doRequest } from "../helpers/doRequest.js";
import { getFocusLang, renderLangControls } from "../helpers/focusLangControls.js";
import { handleRequestError } from "../helpers/handleRequestError.js";
import { markdownToHtml } from "../helpers/markdownToHtml.js";
import { getSupportedLanguageFor, getTextForLanguage } from "../languages.js";

const langConfig = getSupportedLanguageFor(document.documentElement.lang);

let user;

function isRawViewOn() {
    const isOn = localStorage.getItem("raw");
    return (isOn === "yes");
}

function toggleRawView() {
    const formattedContainer = document.getElementById("formatted-biography-text");
    const rawContainer = document.getElementById("raw-biography-text");

    if (isRawViewOn()) {
        localStorage.setItem("raw", "no");
        if (formattedContainer) formattedContainer.style.display = "block";
        if (rawContainer) rawContainer.style.display = "none";

    } else {
        localStorage.setItem("raw", "yes");
        if (formattedContainer) formattedContainer.style.display = "none";
        if (rawContainer) rawContainer.style.display = "block";
    }

    displayBio();
}

function displayBio() {
    const bioToDisplay = user.biographies[getFocusLang()] || user.biographies.us;

    if (isRawViewOn()) {
        const rawContainer = document.getElementById("raw-biography-text");

        if (rawContainer && rawContainer instanceof HTMLTextAreaElement) {
            rawContainer.value = bioToDisplay.text;
        }
    } else {
        const formattedContainer = document.getElementById("formatted-biography-text");
        if (formattedContainer) formattedContainer.innerHTML = markdownToHtml("live", bioToDisplay.text);
    }
}

async function load() {
    console.group(`Loading...`);

    const id = window.location.href.slice(window.location.href.indexOf("/view/") + "/view/".length);

    const response = await doRequest({
        url: "/api/users",
        method: "GET",
        headers: {
            id
        },
        body: undefined
    });

    if (response.status !== 200) return handleRequestError(response, langConfig);

    user = (await response.json()).user;

    console.log(`Loaded user:`);
    console.dir(user);
    console.groupEnd();
}

async function main() {
    await load();

    const main = document.getElementById("main");
    const rawViewToggle = document.getElementById("toggle-raw-view");
    const langControlsContainer = document.getElementById("lang-controls");

    if (!rawViewToggle || !main || !langControlsContainer) throw new Error();

    renderLangControls(langControlsContainer, displayBio, ...Object.keys(user.biographies));
    rawViewToggle.addEventListener("click", toggleRawView);

    // Both the formatted and raw views are hidden by default.
    // This will only display the correct one without whether or not the raw view was hidden or not.
    // Also, the view assumes that the raw view is toggled off, which may not always be true.
    // This ensures the correct text is shown.
    toggleRawView();
    toggleRawView();

    displayBio();

    main.style.display = "block";
}

window.addEventListener("DOMContentLoaded", main);