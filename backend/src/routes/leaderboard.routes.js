// src/routes/leaderboard.routes.js

import express from "express";

import { getLeaderboard, getProblemLeaderboard } from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);
router.get("/:problemId", getProblemLeaderboard);


export default router;
