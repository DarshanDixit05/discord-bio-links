import { doRequest } from "./helpers/doRequest.js";

const id = window.location.href.slice(window.location.href.indexOf("v/") + "v/".length);

const headers = {
    id
};

const response = await doRequest({ url: "/api/users", method: "GET", headers, body: undefined });

if (response.status === 200) {
    const { user } = await response.json();
    console.log(user);

    document.write(`${user.username}'s bio: ${user.biography.text}`);
}