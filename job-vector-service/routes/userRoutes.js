import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/sync", async (req, res) => {

    const user = req.body;

    await User.create({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    });

    res.json({
        message: "User Synced"
    });
});

export default router;