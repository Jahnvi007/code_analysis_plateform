//backend/src/routes/stats.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMyStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyStats);

export default router;
