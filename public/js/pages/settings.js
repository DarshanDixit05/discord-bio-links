// @ts-check
import { askConfirmation } from "../helpers/askConfirmation.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { doRequest } from "../helpers/doRequest.js";
import { handleRequestError } from "../helpers/handleRequestError.js";
import { isValidSession } from "../helpers/isValidSession.js";
import { getSupportedLanguageFor, getTextForLanguage } from "../languages.js";

const langConfig = getSupportedLanguageFor(document.documentElement.lang);

let session;
let user;

async function login() {
    const rawSavedSession = localStorage.getItem("session") || "null";
    const savedSession = JSON.parse(rawSavedSession);

    if (!isValidSession(savedSession)) throw new Error();

    return savedSession;
}

async function load() {
    console.group(`Loading...`);
    session = await login();

    const response = await doRequest({
        url: "/api/users",
        method: "GET",
        headers: {
            id: session.id
        },
        body: undefined
    });

    if (response.status !== 200) throw new Error();

    user = (await response.json()).user;

    console.log(`Loaded user:`);
    console.dir(user);
    console.log(`Loaded session:`);
    console.dir(session);

    console.groupEnd();
}

async function logout() {
    await doRequest({
        url: "/api/users",
        method: "PATCH",
        headers: {
            code: "RESET",
            state: "RESET",
            tempid: "RESET",
            authorization: JSON.stringify(session)
        },
        body: undefined
    });

    localStorage.clear();
    setTimeout(() => window.location.href = "/", 3_000);
}

async function deleteAccount() {
    await doRequest({
        url: "/api/users",
        method: "DELETE",
        headers: {
            authorization: JSON.stringify(session)
        },
        body: undefined
    });

    localStorage.clear();
    setTimeout(() => window.location.href = "/", 3_000);
}

async function main() {
    try {
        await load();
    } catch (err) {
        return displayMessage(getTextForLanguage(langConfig, "expiredSession"), "fatal");
    }

    const main = document.getElementById("main");
    const logoutButton = document.getElementById("logout");
    const deleteButton = document.getElementById("delete");

    if (!main || !logoutButton || !deleteButton) throw new Error();

    logoutButton.addEventListener("click", function () {
        askConfirmation(getTextForLanguage(langConfig, "logoutConfirmation"), logout, () => 0)
    });

    deleteButton.addEventListener("click", function () {
        askConfirmation(getTextForLanguage(langConfig, "deleteConfirmation"), deleteAccount, () => 0);
    });

    main.style.display = "block";
}

window.addEventListener("DOMContentLoaded", main);