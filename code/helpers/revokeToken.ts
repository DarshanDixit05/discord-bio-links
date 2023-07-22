import { cfg } from "../config.js";
import { PartialDiscordUserObject, isPartialDiscordUserObject } from "../structures/discord/PartialDiscordUserObject.js";
import { doRequest } from "./doRequest.js";

export async function revokeToken(accessToken: string): Promise<void> {
    const url = "https://discord.com/api/oauth2/token/revoke";

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const body: string = new URLSearchParams({
        "client_id": cfg.client.id,
        "client_secret": cfg.client.secret,
        "token": accessToken
    }).toString();

    await doRequest("POST", url, headers, body)
}