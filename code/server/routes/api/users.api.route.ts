import { Router } from "express";
import { lookUp } from "../../controllers/users/lookup.js";
import { finishLogin } from "../../controllers/users/finishLogin.js";
import { revoke } from "../../controllers/users/revoke.js";
import { remove } from "../../controllers/users/remove.js";
import { getAuthLink } from "../../controllers/users/getAuthLink.js";
import { updateBios } from "../../controllers/users/updateBio.js";
import { auth } from "../../middlewares/auth.middleware.js";

const users = Router();

users.get("/", lookUp);
users.delete("/", auth, remove);

users.get("/login", getAuthLink);
users.post("/bios", auth, updateBios);
users.post("/login", finishLogin);
users.post("/revoke", auth, revoke);

export { users };