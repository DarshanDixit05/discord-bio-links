export interface UserLookupRequest {
    id: string;
}

export function isUserLookupRequest(o: unknown): o is UserLookupRequest {
    if (o) {
        if (typeof o === "object") {
            if ("id" in o) {
                if (typeof o.id === "string") {
                    return true;
                }
            }
        }
    }
    return false;
}