import { NextFunction, Request, Response } from "express";
import { InternalUser } from "../../../structures/InternalUser.js";
import { User } from "../../../structures/User.js";

export async function updateBios(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));
        const internalUser = new InternalUser(userId);

        try {
            InternalUser.validateBios(req.body);
        } catch (err) {
            throw new Error("INVALID_REQUEST");
        }

        await internalUser.editBios(req.body);

        const user: User = await internalUser.get();
        res.json({ user });
    } catch (err) {
        next(err);
    }
}