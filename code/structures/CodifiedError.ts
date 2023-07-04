export class CodifiedError extends Error {
    public readonly code: string;

    constructor(code: string, message?: string) {
        super(message);
        this.name = "CodifiedError";
        this.code = code;
    }
};