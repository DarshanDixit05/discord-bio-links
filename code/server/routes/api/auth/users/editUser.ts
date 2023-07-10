import express, { Router } from "express";
import { InternalUser } from "../../../../../structures/InternalUser.js";
import DOMPurify from "isomorphic-dompurify";
import { isBiography } from "../../../../../structures/Biography.js";
import { User } from "../../../../../structures/User.js";

const editUser = Router();

editUser.post("/", express.json(), async function (req, res, next) {
    try {
        const { authorization } = req.headers;

        // This is safe to do because of the authentification middleware.
        // @ts-ignore
        const userId = authorization.slice(0, authorization.indexOf(" "));

        const internalUser = new InternalUser(userId);

        for (const bio of Object.values(req.body)) {
            if (!isBiography(bio)) throw new Error("INVALID_REQUEST");
            bio.text = DOMPurify.sanitize(bio.text.trim());
        }

        await internalUser.editBios(req.body);

        const user: User = await internalUser.get();
        res.json({ user });
    } catch (err) {
        next(err);
    }
});


export default editUser;