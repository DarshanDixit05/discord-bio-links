import { ErrorRequestReplyOptions } from "../structures/ErrorRequestReplyOptions.js";

export function replyToRequestWithError(options: ErrorRequestReplyOptions): void {
    try {
        if (options.res.headersSent) return;
        options.res.status(options.httpCode).json({ message: options.errorMessage, code: options.errorCode });
    } catch (err) {
        console.error(err);
    }
}