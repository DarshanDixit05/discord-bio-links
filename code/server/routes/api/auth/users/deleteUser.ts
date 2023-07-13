// @ts-check
import { Router } from "express";
import { InternalUser } from "../../../../../structures/InternalUser.js";

const deleteUser = Router();

deleteUser.delete("/", async function (req, res, next) {
    try {
        const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));

        const internalUser: InternalUser = new InternalUser(userId);

        await internalUser.revokeToken();
        await internalUser.delete();

        res.cookie("session", "");
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default deleteUser;