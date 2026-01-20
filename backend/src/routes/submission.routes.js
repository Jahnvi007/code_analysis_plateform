// src/routes/submission.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateSubmission } from "../middlewares/validation.middleware.js";
import {
  submitCode,
  getMySubmissions,
  getSubmissionById,
  explainSubmission
} from "../controllers/submission.controller.js";

console.log("🔥 submission.routes.js LOADED");

const router = express.Router();

/* Router-level logger (SAFE) */
router.use((req, res, next) => {
  console.log("📦 SUBMISSIONS ROUTER:", req.method, req.originalUrl);
  next();
});

router.post("/submit", authMiddleware, validateSubmission, submitCode);
router.get("/my-submissions", authMiddleware, getMySubmissions);
router.get("/:id", authMiddleware, getSubmissionById);

/* 🔥 AI explanation route */
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
