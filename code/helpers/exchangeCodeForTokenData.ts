import { cfg } from "../config.js";
import { CodifiedError } from "../structures/CodifiedError.js";
import { DiscordAccessTokenReponse, isDiscordAccessTokenResponse } from "../structures/discord/AccessTokenResponse.js";
import { doRequest } from "./doRequest.js";

export async function exchangeCodeForAccessToken(code: string, redirectUri: string): Promise<DiscordAccessTokenReponse> {
    const url = "https://discord.com/api/oauth2/token";

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const body: string = new URLSearchParams({
        "client_id": cfg.client.id,
        "client_secret": cfg.client.secret,
        "grant_type": "authorization_code",
        "redirect_uri": redirectUri,
        "code": code
    }).toString();

    const response = await doRequest("POST", url, headers, body);

    if (isDiscordAccessTokenResponse(response)) return response;
    throw new CodifiedError("INVALID_CODE_FOR_ACCESS_TOKEN_EXCHANGE", "The given code for the access token exchange is invalid/expired.");
}