import { Router } from "express";
import { isUserLookupRequest } from "../../../../structures/requests/UserLookupRequest.js";
import { InternalUser } from "../../../../structures/InternalUser.js";
import { User } from "../../../../structures/User.js";

const userLookup = Router();

userLookup.get("/", async function (req, res, next) {
    try {
        if (!isUserLookupRequest(req.headers)) throw new Error("INVALID_REQUEST");

        const internalUser = new InternalUser(req.headers.id);
        const user: User = await internalUser.get();

        res.json({ user });
    } catch (err) {
        next(err);
    }
});

export default userLookup; 