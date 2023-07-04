import express, { Router } from "express";

const router = Router();

router.use("/api", express.json());

export default router;