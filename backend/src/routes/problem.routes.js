import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { validateProblem } from "../middlewares/validation.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getTodayProblem,
  getArchiveProblems, // <-- [ADD THIS]
  getSolvedUsersForProblem
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
// [NEW] Archive route before '/:id'!
router.get("/archive", authMiddleware, getArchiveProblems);

router.get("/", authMiddleware, getAllProblems);
// /today MUST be before /:id so Express does not treat "today" as an ObjectId
router.get("/today", authMiddleware, getTodayProblem);
router.get(
  "/:problemId/solved-users",
  authMiddleware,
  authorizeRoles("admin"),
  getSolvedUsersForProblem
);
router.get("/:id", authMiddleware, getProblemById);

export default router;