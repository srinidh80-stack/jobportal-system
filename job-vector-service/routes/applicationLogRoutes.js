import express from "express";
import ApplicationLog from "../models/ApplicationLog.js";

const router = express.Router();

router.post("/log", async (req, res) => {
    try {
        const log = await ApplicationLog.create(req.body);

        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

export default router;