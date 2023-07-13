import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import userLookup from "./api/users/userLookup.js";
import login from "./api/login/login.js";
import authentification from "./api/auth/authentification.js";
import supported from "./api/languages/supported.js";

const api = Router();

const limiter = rateLimit({
    windowMs: 1000 * 60,
    max: 25,
    standardHeaders: true,
    message: { message: "You are making too many requests. Try again later.", code: "RATE_LIMITED" }
});

api.use(express.json());
api.use("/", limiter);
api.use("/users", userLookup);
api.use("/login", login);
api.use("/auth", authentification);
api.use("/languages", supported);

export default api;