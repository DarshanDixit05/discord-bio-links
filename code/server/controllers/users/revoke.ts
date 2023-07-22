import { NextFunction, Request, Response } from "express";
import { InternalUser } from "../../../structures/InternalUser.js";

export async function revoke(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));

        const internalUser: InternalUser = new InternalUser(userId);

        await internalUser.revokeToken();

        res.cookie("session", "");
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};