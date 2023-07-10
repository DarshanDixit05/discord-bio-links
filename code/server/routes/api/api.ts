import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import userLookup from "./users/userLookup.js";
import login from "./login/login.js";
import authentification from "./auth/authentification.js";

const api = Router();

const limiter = rateLimit({
    windowMs: 1000 * 60 * 3,
    max: 15,
    standardHeaders: true,
    message: { message: "You are making too many requests. Try again later.", code: "RATE_LIMITED" }
});

api.use("/", limiter);
api.use("/users", userLookup);
api.use("/login", login);
api.use("/auth", authentification);

export default api;