// @ts-check
import { askConfirmation } from "../helpers/askConfirmation.js";
import { displayMessage } from "../helpers/displayMessage.js";
import { doRequest } from "../helpers/doRequest.js";
import { handleRequestError } from "../helpers/handleRequestError.js";
import { getSupportedLanguageFor, getTextForLanguage } from "../languages.js";

const langConfig = getSupportedLanguageFor(document.documentElement.lang);

let session;
let user;

async function login() {
    const savedSession = localStorage.getItem("session") || "";
    return savedSession;
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
        url: "/api/auth/users",
        method: "DELETE",
        headers: {
            type: "logout",
            authorization: session
        },
        body: undefined
    });

    localStorage.clear();
    setTimeout(() => window.location.href = "/", 3_000);
}

async function deleteAccount() {
    await doRequest({
        url: "/api/auth/users",
        method: "DELETE",
        headers: {
            type: "delete",
            authorization: session
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