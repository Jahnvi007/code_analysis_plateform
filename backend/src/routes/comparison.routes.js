// backend/src/routes/comparison.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { validateComparison } from "../middlewares/validation.middleware.js";
import {
  compareSubmissions,
  getMyComparisons,
  getTopSolutions
} from "../controllers/comparison.controller.js";

const router = express.Router();

router.post(
  "/compare/:submissionId",
  authMiddleware,
  compareSubmissions
);

router.get("/my-comparisons", authMiddleware, getMyComparisons);
router.get("/top/:problemId", authMiddleware, getTopSolutions);

export default router;