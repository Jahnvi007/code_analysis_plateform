//backend/src/routes/user.routes.js
import express from "express";
import { getMe, updateMe, getUserHistory } from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET profile
router.get("/me", authMiddleware, getMe);

// UPDATE profile
router.put("/me", authMiddleware, updateMe);
router.get("/history", authMiddleware,getUserHistory); // GET user problem history (calendar)

export default router;       
