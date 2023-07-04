export interface Biography {
    text: string;
}

export function isBiography(o: unknown): o is Biography {
    if (o) {
        if (typeof o === "object") {
            if ("text" in o) {
                if (typeof o.text === "string") {
                    return true;
                }
            }
        }
    }
    return false;
}