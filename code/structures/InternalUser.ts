import Keyv from "keyv";
import { cfg } from "../config.js";
import { Biography, isBiography } from "./Biography.js";
import { User } from "./User.js";
import { getFreshTokenData } from "../helpers/getFreshTokenData.js";
import { getPartialDiscordUserData } from "../helpers/getPartialDiscordUserData.js";
import { PartialDiscordUserObject } from "./discord/PartialDiscordUserObject.js";
import { DiscordAccessTokenReponse } from "./discord/AccessTokenResponse.js";
import { SessionToken } from "./Session.js";
import { randomBytes } from "crypto";
import DOMPurify from 'isomorphic-dompurify';
import { isValidDiscordId } from "../helpers/isValidDiscordId.js";
import { lang } from "../languages.js";
import { revokeToken } from "../helpers/revokeToken.js";

const users = new Keyv(`sqlite://${cfg.databasePaths.users}`);
const sessions = new Keyv(`sqlite://${cfg.databasePaths.sessions}`);

export class InternalUser {
    static readonly TEN_DAYS_IN_MILLISECONDS: number = 1 * 1000 * 60 * 60 * 24 * 10;
    public readonly id: string;
    private _biographies: Record<keyof typeof lang, Biography>;
    private _refreshToken: string;

    constructor(id: string) {
        if (!isValidDiscordId(id)) throw new TypeError("NOT_A_DISCORD_ID");
        this.id = id;
        this._biographies = {
            us: {
                text: ""
            },
            fr: {
                text: ""
            }
        };
        this._refreshToken = "";
    }

    static isInternalUser(o: unknown): o is InternalUser {
        if (o) {
            if (typeof o === "object") {
                if ("id" in o && "_biography" in o && "_refreshToken" in o && "_sessionToken" in o) {
                    if (typeof o.id === "string" && isBiography(o._biography) && typeof o._refreshToken === "string" && typeof o._sessionToken === "string") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static toUser(internalUser: InternalUser, partialDiscordUser: PartialDiscordUserObject): User {
        return {
            id: internalUser.id,
            biographies: internalUser._biographies,
            avatarHash: partialDiscordUser.avatar || "",
            username: partialDiscordUser.username,
            displayName: partialDiscordUser.global_name || partialDiscordUser.username
        };
    }

    static async has(id: string): Promise<boolean> {
        return (await users.has(id));
    }

    private async _fetch(): Promise<InternalUser> {
        const rawFetched = await users.get(this.id);
        if (rawFetched === undefined) throw new Error("UNKNOWN_INTERNAL_USER");
        const fetched: InternalUser = Object.assign(new InternalUser(this.id), rawFetched);
        return fetched;
    }

    public async delete(): Promise<void> {
        await users.delete(this.id);
    }

    public async save(): Promise<true> {
        return await users.set(this.id, this);
    }

    public async updateRefreshToken(newRefreshToken: string): Promise<true> {
        const fetchedThis: InternalUser = await this._fetch();
        fetchedThis._refreshToken = newRefreshToken;
        return await fetchedThis.save();
    }

    public async revokeToken(): Promise<true> {
        const tokenData = await this._getNewAccessToken();
        await revokeToken(tokenData.access_token);
        return true;
    }

    private async _updateSession(newSession: SessionToken): Promise<true> {
        return await sessions.set(this.id, newSession, InternalUser.TEN_DAYS_IN_MILLISECONDS);
    }

    private async _getNewAccessToken(): Promise<DiscordAccessTokenReponse> {
        const fetchedThis: InternalUser = await this._fetch();
        const freshTokenData = await getFreshTokenData(fetchedThis._refreshToken);
        await fetchedThis.updateRefreshToken(freshTokenData.refresh_token);
        return freshTokenData;
    }

    public async getNewSession(): Promise<SessionToken> {
        const newSession = randomBytes(32).toString("base64url");
        await this._updateSession(newSession);
        return newSession;
    }

    public async editBios(newBios: Record<keyof typeof lang, Biography>): Promise<true> {
        const fetchedThis: InternalUser = await this._fetch();

        for (const bio of Object.values(newBios)) {
            bio.text = DOMPurify.sanitize(bio.text, { USE_PROFILES: { html: true } })
        }

        fetchedThis._biographies = newBios;
        return await fetchedThis.save();
    }

    public async get(): Promise<User> {
        const fetchedThis: InternalUser = await this._fetch();
        const freshTokenData = await fetchedThis._getNewAccessToken();

        const partialDiscordUserData = await getPartialDiscordUserData(freshTokenData.access_token, freshTokenData.token_type);
        return InternalUser.toUser(fetchedThis, partialDiscordUserData);

    }

    public async sessionTokenIs(token: SessionToken): Promise<boolean> {
        return ((await sessions.get(this.id)) === token);
    }

    public async hasNonExpiredSession(): Promise<boolean> {
        return ((await sessions.get(this.id)) !== undefined);
    }
}