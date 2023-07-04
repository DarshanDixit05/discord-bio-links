import express, { Router } from "express";
import { cfg } from "../../config.js";

const router = Router();

router.use("/", express.static(cfg.directories.public));

router.get("/", function (req, res) {
    res.sendFile("/pages/index.html", { root: cfg.directories.public })
});

export default router;