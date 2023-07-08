import { lang } from "../languages.js";
import { Biography } from "./Biography.js";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarHash: string;
    biographies: Record<keyof typeof lang, Biography>;
}