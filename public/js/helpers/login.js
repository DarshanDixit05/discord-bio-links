// @ts-check
import { urlHasParam } from "./urlHasParams.js";
import { doRequest } from "./doRequest.js";

async function startDiscordLogin() {
    console.group(`Starting Discord login`);
    console.trace();

    localStorage.clear();
    const response = await doRequest({ url: "/api/auth/link", method: "GET", headers: undefined, body: undefined });

    console.log(`Server response:`, response);

    if (response.status === 200) {
        const { authUrl, loginAttempt } = await response.json();

        console.log(`authUrl:`, authUrl);
        console.log(`loginAttempt:`, loginAttempt);

        localStorage.setItem("tempId", loginAttempt.id);

        const link = document.createElement("a");
        link.href = authUrl;
        link.innerText = "Connect with Discord!";

        document.body.appendChild(link);
        console.log(`Successfully initiated Discord login!`);
    }

    console.groupEnd();
}

async function finishDiscordLogin() {
    console.group(`Attempting to finish Discord login`);
    console.trace();

    const tempId = localStorage.getItem("tempId");
    if (tempId === null) return await startDiscordLogin();

    const indexOfInterrogationMark = window.location.href.indexOf("?");
    const urlParamsSearcher = new URLSearchParams(window.location.href.slice(indexOfInterrogationMark));

    const state = urlParamsSearcher.get("state");
    const code = urlParamsSearcher.get("code");

    const headers = {
        state, code, id: tempId
    };

    console.log(`Request headers:`, headers);

    const response = await doRequest({ url: "/api/users", method: "PUT", headers, body: undefined });
    console.log(`Server response:`, response);

    if (response.status === 200) {
        const { session } = await response.json();

        console.log(`Session:`, session);

        localStorage.setItem("session", JSON.stringify(session));
        console.log(`Successfully finished Discord login!`);
        console.groupEnd();

        return session;
    }

    console.groupEnd();
}

export async function login() {
    const rawSession = localStorage.getItem("session");

    if (rawSession) {
        const session = JSON.parse(rawSession) || "{}";

        if ("token" in session && "expirationTimestamp" in session && "id" in session) {
            // User has a valid session and can make requests to the API using that.
            return session;
        } else {
            console.error(`Invalid session.`);
            await startDiscordLogin();
        }
    } else {
        if (urlHasParam("code") && urlHasParam("state")) {
            // Step 2 of logging with Discord.
            return await finishDiscordLogin();
        } else {
            // User is not logged in at all.
            await startDiscordLogin();
        }
    }
}