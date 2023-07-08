import { PartialDiscordUserObject, isPartialDiscordUserObject } from "../structures/discord/PartialDiscordUserObject.js";
import { doRequest } from "./doRequest.js";

export async function getPartialDiscordUserData(accessToken: string, accessTokenType: string): Promise<PartialDiscordUserObject> {
    const url = "https://discord.com/api/users/@me";

    const headers = {
        Authorization: `${accessTokenType} ${accessToken}`
    };

    const body = "";

    const response = await doRequest("GET", url, headers, body);

    if (isPartialDiscordUserObject(response)) return response;
    throw new Error("INVALID_TOKEN");
}