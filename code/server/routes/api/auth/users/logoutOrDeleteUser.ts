import { Router } from "express";
import { InternalUser } from "../../../../../structures/InternalUser.js";

const logoutOrDeleteUser = Router();

logoutOrDeleteUser.delete("/", async function (req, res, next) {
    try {
        const types = [
            "logout",
            "delete"
        ];

        const { type } = req.headers;

        if (typeof type !== "string") throw new Error("INVALID_REQUEST");
        if (!types.includes(type)) throw new Error("INVALID_REQUEST");

        const { authorization } = req.headers;

        // This is safe to do because of the authentification middleware.
        // @ts-ignore
        const userId = authorization.slice(0, authorization.indexOf(" "));

        const internalUser: InternalUser = new InternalUser(userId);

        await internalUser.revokeToken();

        if (type === "delete") await internalUser.delete();

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default logoutOrDeleteUser;