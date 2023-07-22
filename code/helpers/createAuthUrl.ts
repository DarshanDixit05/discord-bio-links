import { cfg } from "../config.js";

export function createAuthUrl(redirectUri: string, state: string, scopes: string[]): string {
    const scopeString = scopes.join(`%20`);
    return `https://discord.com/oauth2/authorize?response_type=code&client_id=${cfg.client.id}&scope=${scopeString}&state=${state}&redirect_uri=${redirectUri}&prompt=consent`
}