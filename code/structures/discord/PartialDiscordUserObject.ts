export interface PartialDiscordUserObject {
    id: string;
    username: string;
    global_name: string | undefined;
    avatar: string | undefined;
    accent_color: number | undefined;
}

export function isPartialDiscordUserObject(o: unknown): o is PartialDiscordUserObject {
    if (o) {
        if (typeof o === "object") {
            if (
                "id" in o &&
                "username" in o
            ) {
                if (
                    typeof o.id === "string" &&
                    typeof o.username === "string"
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}