import { Response } from "express";

export interface ErrorRequestReplyOptions {
    res: Response;
    httpCode: number;
    errorCode: string;
    errorMessage: string;
}