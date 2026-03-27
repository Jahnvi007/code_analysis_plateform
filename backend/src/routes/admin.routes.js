// backend/src/routes/admin.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
  getProblemQueue,
  getAllUsersWithStats,
  getAllSubmissions,
  getAdminStats // <----- add to destructure for clarity!
} from "../controllers/admin.controller.js";

const router = express.Router();

// Optionally: This route can be used to verify admin access
router.get(
  "/admin-only",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user
    });
  }
);

// All admin endpoints below are guarded!
router.get(
  "/queue",
  authMiddleware,
  authorizeRoles("admin"),
  getProblemQueue
);
router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsersWithStats
);
router.get(
  "/submissions",
  authMiddleware,
  authorizeRoles("admin"),
  getAllSubmissions
);

// ---- ADD THIS: ADMIN DASHBOARD SUMMARY ROUTE ----
router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("admin"),
  getAdminStats
);

export default router;