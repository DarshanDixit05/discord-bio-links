// @ts-check
import { displayMessage } from "../helpers/displayMessage.js";
import { doRequest } from "../helpers/doRequest.js";
import { getFocusLang, renderLangControls } from "../helpers/focusLangControls.js";
import { handleRequestError } from "../helpers/handleRequestError.js";
import { markdownToHtml } from "../helpers/markdownToHtml.js";
import { getSupportedLanguageFor, getTextForLanguage } from "../languages.js";

let user;
let session;

const langConfig = getSupportedLanguageFor(document.documentElement.lang);

async function login() {
    const savedSession = localStorage.getItem("session");

    if (savedSession) {
        return savedSession;
    } else {
        const indexOfInterrogationMark = window.location.href.indexOf("?");
        const urlParamsSearcher = new URLSearchParams(window.location.href.slice(indexOfInterrogationMark));

        if (urlParamsSearcher.get("code") && urlParamsSearcher.get("state") && localStorage.getItem("tempId")) {
            // 2nd step of Discord login.
            const response = await doRequest({
                url: "/api/login",
                method: "POST",
                headers: {
                    code: urlParamsSearcher.get("code"),
                    state: urlParamsSearcher.get("state"),
                    tempid: localStorage.getItem("tempId")
                },
                body: undefined
            });

            if (response.status !== 200) {
                if (response.status === 422) {
                    localStorage.clear();
                    window.location.href = "/";
                }

                handleRequestError(response, langConfig);
                throw new Error();
            } else {
                const { session } = await response.json();
                console.log(session);

                localStorage.setItem("session", session);
                displayMessage(getTextForLanguage(langConfig, "discordLoggedIn"), "neutral");
                return session;
            }
        } else {
            // 1st step of Discord login.
            const response = await doRequest({
                url: "/api/login/link",
                method: "GET",
                headers: undefined,
                body: undefined
            });

            if (response.status !== 200) {
                handleRequestError(response, langConfig);
            } else {
                const { authUrl, loginAttempt } = await response.json();

                const loginSection = document.getElementById("login");
                const loginLinkTag = document.getElementById("login-link");

                if (!loginSection || !loginLinkTag || !(loginLinkTag instanceof HTMLAnchorElement)) throw new Error();

                localStorage.setItem("tempId", loginAttempt.id);
                loginLinkTag.href = authUrl;
                loginSection.style.display = "block";
            }
        }
    }

    throw new Error();
}

function displayBio() {
    const bioToDisplay = user.biographies[getFocusLang()] || user.biographies.us;
    const displayArea = document.getElementById("biography-input");

    if (displayArea && displayArea instanceof HTMLTextAreaElement) {
        displayArea.value = "";
        setTimeout(() => {
            if (bioToDisplay.text.trim() === "") displayArea.value = `# ${user.displayName}`;
            else displayArea.value = bioToDisplay.text.replaceAll("\n<br>", "\n\n");
            displayPreview();
        }, 300);
    }
}

function isPreviewOn() {
    const isOn = localStorage.getItem("preview");
    return (isOn === "yes");
}

function togglePreview() {
    const togglePreviewButton = document.getElementById("toggle-preview");
    const previewSection = document.getElementById("preview-section");

    if (isPreviewOn()) {
        localStorage.setItem("preview", "no");
        if (previewSection) previewSection.style.display = "none";
        if (togglePreviewButton) togglePreviewButton.innerText = getTextForLanguage(langConfig, "enablePreview");
    } else {
        localStorage.setItem("preview", "yes");
        if (previewSection) previewSection.style.display = "block";
        if (togglePreviewButton) togglePreviewButton.innerText = getTextForLanguage(langConfig, "disablePreview");

        const input = document.getElementById("biography-input");

        if (input && input instanceof HTMLTextAreaElement) input.oninput = displayPreview;
    }

    displayPreview();
}

function displayPreview() {
    if (!isPreviewOn()) return;

    const input = document.getElementById("biography-input");
    const previewArea = document.getElementById("preview");

    if (input && previewArea && input instanceof HTMLTextAreaElement) {
        previewArea.innerHTML = markdownToHtml("preview", input.value);
    }
}

async function send() {
    const input = document.getElementById("biography-input");

    if (input && input instanceof HTMLTextAreaElement) {
        const editedBio = {
            [getFocusLang()]: {
                text: input.value
            }
        };

        const response = await doRequest({
            url: "/api/auth/users",
            method: "POST",
            headers: {
                authorization: session
            },
            body: Object.assign(user.biographies, editedBio)
        });

        if (response.status === 404) return displayMessage(getTextForLanguage(langConfig, "expiredSession"), "fatal");
        if (response.status !== 200) return handleRequestError(response, langConfig);

        user = (await response.json()).user;
        return displayMessage(getTextForLanguage(langConfig, "biographyModified"), "success");
    }

    throw new Error();
}

async function load() {
    console.group(`Loading...`);
    session = await login();

    const response = await doRequest({
        url: "/api/users",
        method: "GET",
        headers: {
            id: session.slice(0, session.indexOf(" "))
        },
        body: undefined
    });

    if (response.status === 404) return displayMessage(getTextForLanguage(langConfig, "expiredSession"), "fatal");
    if (response.status !== 200) return handleRequestError(response, langConfig);

    user = (await response.json()).user;

    console.log(`Loaded user:`);
    console.dir(user);
    console.log(`Loaded session:`);
    console.dir(session);

    console.groupEnd();
}

async function main() {
    await load();

    const userlink = `${window.location.origin}/view/${user.id}`;

    const main = document.getElementById("main");
    const welcomeContainer = document.getElementById("welcome");
    const sendButton = document.getElementById("send-button");
    const controlsContainer = document.getElementById("controls");
    const togglePreviewButton = document.getElementById("toggle-preview");
    const userLinkDisplay = document.getElementById("your-link");

    if (!main || !welcomeContainer || !controlsContainer || !sendButton || !togglePreviewButton || !userLinkDisplay || !(userLinkDisplay instanceof HTMLAnchorElement)) throw new Error();

    renderLangControls(controlsContainer, displayBio, ...Object.keys(user.biographies));

    sendButton.addEventListener("click", send);
    togglePreviewButton.addEventListener("click", togglePreview);

    welcomeContainer.innerText = getTextForLanguage(langConfig, "welcomeBack", [user.username]);
    userLinkDisplay.innerText = userlink;
    userLinkDisplay.href = userlink;

    displayBio();

    // The view assumes that the preview is toggled off, which may not always be true.
    // This ensures the correct text is shown.
    togglePreview();
    togglePreview();

    //document.title = user.username;

    main.style.display = "block";
}

window.addEventListener("DOMContentLoaded", main);