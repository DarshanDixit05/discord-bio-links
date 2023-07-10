import { Router } from "express";
import { InternalUser } from "../../../../structures/InternalUser.js";
import editUser from "./users/editUser.js";
import logoutOrDeleteUser from "./users/logoutOrDeleteUser.js";

const authentification = Router();

authentification.use("/", async function (req, res, next) {
    try {
        const { authorization } = req.headers;

        if (authorization === undefined) throw new Error("INVALID_REQUEST");

        const sessionToken = authorization.slice(authorization.indexOf(" ") + " ".length);
        const userId = authorization.slice(0, authorization.indexOf(" "));

        const internalUser = new InternalUser(userId);

        const hasNonExpiredSession: boolean = await internalUser.hasNonExpiredSession();
        const correctToken: boolean = await internalUser.sessionTokenIs(sessionToken);

        if (!hasNonExpiredSession) throw new Error("EXPIRED_SESSION");
        if (!correctToken) throw new Error("UNAUTHORIZED");

        next();
    } catch (err) {
        next(err);
    }
});

authentification.use("/users", editUser, logoutOrDeleteUser);

export default authentification; 