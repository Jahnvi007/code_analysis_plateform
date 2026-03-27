// src/routes/submission.routes.js
import express from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateSubmission } from "../middlewares/validation.middleware.js";
import {
  submitCode,
  getMySubmissions,
  getSubmissionById,
  explainSubmission,
  compareSubmissions
} from "../controllers/submission.controller.js";

console.log("🔥 submission.routes.js LOADED");

const router = express.Router();

// 🛡️ Rate limit submissions — configurable via MAX_SUBMISSIONS_PER_HOUR env var
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.MAX_SUBMISSIONS_PER_HOUR, 10) || 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Submission limit reached. Please try again later." }
});

// Router-level logger (SAFE)
router.use((req, res, next) => {
  console.log("📦 SUBMISSIONS ROUTER:", req.method, req.originalUrl);
  next();
});

// ---- ! ORDER MATTERS HERE ! ----
// 1. /compare must be BEFORE /:id, or Express will treat 'compare' as an :id
router.post("/compare", authMiddleware, compareSubmissions);
router.post("/submit", authMiddleware, submissionLimiter, validateSubmission, submitCode);
router.get("/my-submissions", authMiddleware, getMySubmissions);

// /:id route should come after /compare
router.get("/:id", authMiddleware, getSubmissionById);

// AI explanation *after* /:id route, otherwise may also be captured by :id
router.post(
  "/:id/explain",
  authMiddleware,
  (req, res, next) => {
    console.log("🔥 /:id/explain HIT");
    next();
  },
  explainSubmission
);

export default router;