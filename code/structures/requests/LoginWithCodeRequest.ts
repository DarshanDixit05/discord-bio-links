export interface LoginWithCodeRequest {
    code: string;
    state: string;
    id: string;
}

export function isLoginWithCodeRequest(o: unknown): o is LoginWithCodeRequest {
    if (o) {
        if (typeof o === "object") {
            if ("code" in o && "state" in o && "id" in o) {
                if (typeof o.code === "string" && typeof o.id === "string" && typeof o.state === "string") {
                    return true;
                }
            }
        }
    }
    return false;
}