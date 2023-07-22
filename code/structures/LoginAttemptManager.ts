import Keyv from "keyv";
import { cfg } from "../config.js";
import { LoginAttempt } from "./LoginAttempt.js";
import { randomBytes } from "crypto";

const keyv = new Keyv(`sqlite://${cfg.databasePaths.loginAttempts}`);

export class LoginAttemptManager {
    static TWENTY_MINUTES_IN_MILLISECONDS: number = 1 * 1000 * 60 * 20;

    static async addAttempt(): Promise<LoginAttempt> {
        const state: string = randomBytes(24).toString("base64url");
        const id: string = randomBytes(24).toString("base64url");

        await keyv.set(id, state, this.TWENTY_MINUTES_IN_MILLISECONDS);

        return { state, id };
    }

    static async isStateForIdEqualTo(id: string, expectedState: string): Promise<boolean> {
        const actualState: any = await keyv.get(id);
        return (actualState === expectedState);
    }
}