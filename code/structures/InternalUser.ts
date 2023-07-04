import Keyv from "keyv";
import { cfg } from "../config.js";
import { Biography, isBiography } from "./Biography.js";
import { User } from "./User.js";
import { getFreshTokenData } from "../helpers/getFreshTokenData.js";
import { getPartialDiscordUserData } from "../helpers/getPartialDiscordUserData.js";
import { PartialDiscordUserObject } from "./discord/PartialDiscordUserObject.js";
import { DiscordAccessTokenReponse } from "./discord/AccessTokenResponse.js";
import { Session } from "./Session.js";
import { randomBytes } from "crypto";
import { CodifiedError } from "./CodifiedError.js";

const keyv = new Keyv(`sqlite://${cfg.databasePaths.users}`);

export class InternalUser {
    static readonly TEN_DAYS_IN_MILLISECONDS: number = 1 * 1000 * 60 * 60 * 24 * 10;
    public readonly id: string;
    private _biography: Biography;
    private _refreshToken: string;
    private _session: Session;

    constructor(id: string) {
        this.id = id;
        this._biography = { text: "" };
        this._refreshToken = "";
        this._session = {
            id: this.id,
            token: "",
            expirationTimestamp: 0
        };
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
            biography: internalUser._biography,
            avatarHash: partialDiscordUser.avatar || "",
            username: partialDiscordUser.global_name || partialDiscordUser.username
        };
    }

    private async _fetch(): Promise<InternalUser> {
        const rawFetched = await keyv.get(this.id) || {};
        const fetched: InternalUser = Object.assign(new InternalUser(this.id), rawFetched);
        return fetched;
    }

    private async _save(): Promise<true> {
        return await keyv.set(this.id, this);
    }

    public async updateRefreshToken(newRefreshToken: string): Promise<true> {
        const fetchedThis: InternalUser = await this._fetch();
        fetchedThis._refreshToken = newRefreshToken;
        return await fetchedThis._save();
    }

    private async _updateSession(newSession: Session): Promise<true> {
        const fetchedThis: InternalUser = await this._fetch();
        fetchedThis._session = newSession
        return await fetchedThis._save();
    }

    public async getNewSession(): Promise<Session> {
        const newSession: Session = {
            token: randomBytes(64).toString("base64url"),
            expirationTimestamp: Date.now() + InternalUser.TEN_DAYS_IN_MILLISECONDS,
            id: this.id
        };

        await this._updateSession(newSession);
        return newSession;
    }

    private async _getNewAccessToken(): Promise<DiscordAccessTokenReponse> {
        const fetchedThis: InternalUser = await this._fetch();
        console.log(this, fetchedThis);
        if (fetchedThis._refreshToken === "") throw new TypeError(`Refresh token is empty string!`);
        const freshTokenData = await getFreshTokenData(fetchedThis._refreshToken);
        await fetchedThis.updateRefreshToken(freshTokenData.refresh_token);
        return freshTokenData;
    }

    public async editBio(newBio: Biography): Promise<true> {
        const fetchedThis: InternalUser = await this._fetch();
        fetchedThis._biography = newBio;
        return await fetchedThis._save();
    }

    public async get(): Promise<User> {
        try {
            const fetchedThis: InternalUser = await this._fetch();
            const freshTokenData = await fetchedThis._getNewAccessToken();

            const partialDiscordUserData = await getPartialDiscordUserData(freshTokenData.access_token, freshTokenData.token_type);
            return InternalUser.toUser(fetchedThis, partialDiscordUserData);
        } catch (err) {
            console.error(err);
            throw new CodifiedError("UNKNOWN_INTERNAL_USER");
        }
    }

    public async sessionTokenIs(token: string): Promise<boolean> {
        const fetchedThis: InternalUser = await this._fetch();
        return (fetchedThis._session.token === token);
    }

    public async isSessionValid(): Promise<boolean> {
        const fetchedThis: InternalUser = await this._fetch();
        return (fetchedThis._session.expirationTimestamp > Date.now());
    }
}