import { Biography } from "./Biography.js";

export interface User {
    id: string;
    username: string;
    avatarHash: string;
    biography: Biography;
}