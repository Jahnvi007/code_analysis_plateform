// backend/src/routes/problem.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { validateProblem } from "../middlewares/validation.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} from "../controllers/problem.controller.js";

const router = express.Router();

/* ===== ADMIN ===== */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  validateProblem,
  createProblem
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateProblem
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteProblem
);

/* ===== USER ===== */
router.get("/", authMiddleware, getAllProblems);
router.get("/:id", authMiddleware, getProblemById);

export default router;