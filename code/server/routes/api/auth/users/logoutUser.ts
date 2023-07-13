// @ts-check
import { Router } from "express";
import { InternalUser } from "../../../../../structures/InternalUser.js";

const logoutUser = Router();

logoutUser.post("/", async function (req, res, next) {
    try {
        const userId = req.cookies.session.slice(0, req.cookies.session.indexOf(" "));
        const internalUser: InternalUser = new InternalUser(userId);
        await internalUser.revokeToken();
        res.cookie("session", "");
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

export default logoutUser;