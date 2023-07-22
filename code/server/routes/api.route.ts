import { Router } from "express";
import { users } from "./api/users.api.route.js";
import { lang } from "./api/languages.api.routes.js";
import rateLimit from "express-rate-limit";

const api = Router();

api.use(rateLimit({
    windowMs: 1000 * 60,
    max: 25,
    standardHeaders: true,
    message: { message: "You are making too many requests. Try again later.", code: "RATE_LIMITED" }
}));
api.use("/users", users);
api.use("/language", lang);

export default api;