export interface DiscordAccessTokenReponse {
    access_token: string;
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string;
};

export function isDiscordAccessTokenResponse(o: unknown): o is DiscordAccessTokenReponse {
    if (o) {
        if (typeof o === "object") {
            if (
                "access_token" in o &&
                "token_type" in o &&
                "expires_in" in o &&
                "refresh_token" in o &&
                "scope" in o
            ) {
                if (
                    typeof o.access_token === "string" &&
                    typeof o.token_type === "string" &&
                    typeof o.expires_in === "number" &&
                    typeof o.refresh_token === "string" &&
                    typeof o.scope === "string"
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}