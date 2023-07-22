import { Router } from "express";
import { InternalUser } from "../../../../structures/InternalUser.js";
import cookieParser from "cookie-parser";
import users from "./users/users.js";

const authentification = Router();

authentification.use(cookieParser(), async function (req, res, next) {
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
});

authentification.use("/users", users);

export default authentification; 