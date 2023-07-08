import express, { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

const limiter = rateLimit({
    windowMs: 1000 * 60 * 3,
    max: 15,
    standardHeaders: true,
    message: { message: "You are making too many requests. Try again later.", code: "RATE_LIMITED" }
});

router.use("/api", limiter);
router.use("/api", express.json());

export default router;