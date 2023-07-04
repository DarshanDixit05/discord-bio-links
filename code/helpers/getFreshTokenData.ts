import { cfg } from "../config.js";
import { CodifiedError } from "../structures/CodifiedError.js";
import { DiscordAccessTokenReponse, isDiscordAccessTokenResponse } from "../structures/discord/AccessTokenResponse.js";
import { doRequest } from "./doRequest.js";

export async function getFreshTokenData(refreshToken: string): Promise<DiscordAccessTokenReponse> {
    const url = "https://discord.com/api/oauth2/token";

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const body: string = new URLSearchParams({
        "client_id": cfg.client.id,
        "client_secret": cfg.client.secret,
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
    }).toString();

    const response = await doRequest("POST", url, headers, body);

    if (isDiscordAccessTokenResponse(response)) return response;
    throw new CodifiedError("INVALID_REFRSH_TOKEN", "The given refresh token is invalid.");
}