import { NextFunction, Request, Response } from "express";
import { User } from "../../../structures/User.js";
import { InternalUser } from "../../../structures/InternalUser.js";

function validateData(obj: unknown): obj is { id: string } {
    if (obj !== null && typeof obj === "object") {
        if (
            "id" in obj && typeof obj.id === "string"
        ) return true;
    }

    return false;
}

export async function lookUp(req: Request, res: Response, next: NextFunction) {
    try {
        if (!validateData(req.headers)) throw new Error("INVALID_REQUEST");

        const internalUser = new InternalUser(req.headers.id);
        const user: User = await internalUser.get();

        res.json({ user });
    } catch (err) {
        next(err);
    }
}