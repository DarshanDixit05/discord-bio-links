import { NextFunction, Request, Response } from "express";
import { InternalUser } from "../../structures/InternalUser.js";

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        if (typeof req.cookies.session !== "string") throw new Error("INVALID_REQUEST");

        const sessionToken = req.cookies.session.slice(req.cookies.session.indexOf(" ") + " ".length);
        const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));

        const internalUser = new InternalUser(userId);

        const hasNonExpiredSession: boolean = await internalUser.hasNonExpiredSession();
        const correctToken: boolean = await internalUser.sessionTokenIs(sessionToken);

        if (!hasNonExpiredSession) throw new Error("EXPIRED_SESSION");
        if (!correctToken) throw new Error("UNAUTHORIZED");

        next();
    } catch (err) {
        res.cookie("session", "");
        next(err);
    }
}; 