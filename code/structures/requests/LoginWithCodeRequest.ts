export interface LoginWithCodeRequest {
    code: string;
    state: string;
    tempid: string;
}

export function isLoginWithCodeRequest(o: unknown): o is LoginWithCodeRequest {
    if (o) {
        if (typeof o === "object") {
            if ("code" in o && "state" in o && "tempid" in o) {
                if (typeof o.code === "string" && typeof o.tempid === "string" && typeof o.state === "string") {
                    return true;
                }
            }
        }
    }
    return false;
}