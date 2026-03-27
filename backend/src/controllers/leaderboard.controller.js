// src/controllers/leaderboard.controller.js

import { generatePerformanceScoreLeaderboard } from "../services/ranking.service.js";
import Submission from "../models/Submission.model.js";

/* ============ GLOBAL LEADERBOARD (ALL-TIME) ============ */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await generatePerformanceScoreLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};

/* ============ PROBLEM-SPECIFIC / PER-DAY LEADERBOARD ============ */
// GET /api/leaderboard/:problemId
export const getProblemLeaderboard = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Only accepted submissions for this problem
    const submissions = await Submission.find({ 
      problem: problemId, 
      status: "Accepted" 
    })
    .sort({
      score: -1, // Higher score is better
      "metrics.totalExecutionTimeMs": 1, // If tie, faster is better
      createdAt: 1, // If still tie, earlier first
    })
    .populate("user", "name email"); // Only necessary user fields

    // Prepare leaderboard entries for frontend
    const leaderboard = submissions.map((sub, i) => ({
      rank: i + 1,
      userId: sub.user._id,
      userName: sub.user.name,
      email: sub.user.email,
      score: sub.score,
      executionTimeMs: sub.metrics?.totalExecutionTimeMs ?? null,
      memoryUsedKB: sub.metrics?.maxMemoryUsedKB ?? null,
      submissionId: sub._id,
      createdAt: sub.createdAt,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("PROBLEM LEADERBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to load per-problem leaderboard" });
  }
};