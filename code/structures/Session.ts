export interface Session {
    token: string;
    expirationTimestamp: number;
    id: string;
}

export function isSession(o: any): o is Session {
    if (o) {
        if (typeof o === "object") {
            if ("token" in o && "expirationTimestamp" in o && "id" in o) {
                if (typeof o.token === "string" && typeof o.expirationTimestamp === "number" && typeof o.id === "string") {
                    return true;
                }
            }
        }
    }
    return false;
}