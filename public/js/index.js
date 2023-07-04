import { login } from "./helpers/login.js";
import { doRequest } from "./helpers/doRequest.js";

const session = await login();

if (session) {
    console.log(`Logged in!`, session);

    const headers = {
        id: session.id
    };

    const response = await doRequest({ url: "/api/users", method: "GET", headers, body: undefined });
    console.log(`Server response:`, response);

    if (response.status === 200) {
        const { user } = await response.json();

        const welcomeContainer = document.getElementById("welcome-container");
        const bioInput = document.getElementById("biography-input");
        const sendButton = document.getElementById("send-button");
        const yourLink = document.getElementById("your-link");

        if (welcomeContainer && bioInput && sendButton && yourLink) {
            sendButton.addEventListener("click", async function (event) {
                event.preventDefault();

                if (bioInput.value.length > 0) {
                    const headers = {
                        Authorization: `${session.token}`,
                        id: session.id
                    };

                    const body = {
                        text: bioInput.value
                    };

                    const response = await doRequest({ url: "/api/users", method: "POST", headers, body });

                    if (response.status === 200) {
                        alert("Success!");
                    } else if (response.status == 401) {
                        alert("Your session expired, please login again.");

                        localStorage.clear();

                        const indexOfInterrogationMark = window.location.href.indexOf("?");
                        window.location = window.location.href.slice(indexOfInterrogationMark);

                        await login();
                    }
                } else alert("Please enter some text.");
            });

            yourLink.innerText += ` http://localhost:3000/v/${user.id}`;
            welcomeContainer.innerText = `Welcome, ${user.username}!`;
        }
    } else if (response.status === 404) {
        await login();
    }
}