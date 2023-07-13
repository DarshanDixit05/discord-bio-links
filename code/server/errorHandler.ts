import { Request, Response, NextFunction } from "express";
import { errorCodeIndex } from "../structures/ErrorIndex.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let httpErrorCode: number = 500;
    let errorCode: string = "UNKNOWN_ERROR";

    if (err instanceof Error) {
        for (const code in errorCodeIndex) {
            if (err.message.includes(code)) {
                httpErrorCode = errorCodeIndex[code];
                errorCode = code;
            }
        }

        console.error(err);
    }

    res.status(httpErrorCode).json(errorCode);
}