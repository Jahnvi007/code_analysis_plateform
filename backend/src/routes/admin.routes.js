//backend/src/routes/admin.routes.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { getProblemQueue, getAllUsersWithStats, getAllSubmissions } from "../controllers/admin.controller.js";


const router = express.Router();

// Admin-only route
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
router.get("/queue", getProblemQueue);
router.get("/users", getAllUsersWithStats);
router.get("/submissions", getAllSubmissions);


export default router;
