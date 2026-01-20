// src/controllers/leaderboard.controller.js

import { generatePerformanceScoreLeaderboard } from "../services/ranking.service.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await generatePerformanceScoreLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};
