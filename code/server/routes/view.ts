import express, { Router } from "express";
import { cfg } from "../../config.js";

const router = Router();

router.get("/v/:id", function (req, res) {
    res.sendFile("/pages/view.html", { root: cfg.directories.public });
});

export default router;