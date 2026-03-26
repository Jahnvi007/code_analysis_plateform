//backend/src/routes/auth.routes.js
import express from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateSignup, validateLogin } from "../middlewares/validation.middleware.js";
import {
  signup,
  login,
  refreshAccessToken,
  logout
} from "../controllers/auth.controller.js";

const router = express.Router();

// 🛡️ Strict rate limiter for auth endpoints — 10 attempts / 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." }
});

router.post("/signup", authLimiter, validateSignup, signup);
router.post("/login", authLimiter, validateLogin, login);
router.post("/refresh-token", authLimiter, refreshAccessToken);
router.post("/logout", authMiddleware, logout);

export default router;
