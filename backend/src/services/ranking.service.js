// src/services/ranking.service.js

import Submission from "../models/Submission.model.js";
import User from "../models/User.model.js";

/**
 * Performance Score Based Leaderboard
 * Ranking priority:
 * 1. totalScore (desc)
 * 2. solvedProblems (desc)
 * 3. avgExecutionTime (asc)
 * 4. avgMemoryUsed (asc)
 */
export async function generatePerformanceScoreLeaderboard() {
  const pipeline = [
    // 1️⃣ Only accepted submissions
    {
      $match: { status: "Accepted" }
    },

    // 2️⃣ Best submission per user per problem
    {
      $group: {
        _id: {
          user: "$user",
          problem: "$problem"
        },
        bestScore: { $max: "$score" },
        bestTime: { $min: "$metrics.totalExecutionTimeMs" },
        bestMemory: { $min: "$metrics.maxMemoryUsedKB" }
      }
    },

    // 3️⃣ Aggregate per user
    {
      $group: {
        _id: "$_id.user",
        totalScore: { $sum: "$bestScore" },
        solvedProblems: { $sum: 1 },
        avgExecutionTime: { $avg: "$bestTime" },
        avgMemoryUsed: { $avg: "$bestMemory" }
      }
    },

    // 4️⃣ Sort = ranking rules
    {
      $sort: {
        totalScore: -1,
        solvedProblems: -1,
        avgExecutionTime: 1,
        avgMemoryUsed: 1
      }
    }
  ];

  const rawLeaderboard = await Submission.aggregate(pipeline);

  // 5️⃣ Attach user info + rank
  const leaderboard = await Promise.all(
    rawLeaderboard.map(async (entry, index) => {
      const user = await User.findById(entry._id).select("name");

      return {
        rank: index + 1,
        userId: entry._id,
        name: user?.name || "Unknown",
        totalScore: entry.totalScore,
        solvedProblems: entry.solvedProblems,
        avgExecutionTime: Math.round(entry.avgExecutionTime || 0),
        avgMemoryUsed: Math.round(entry.avgMemoryUsed || 0)
      };
    })
  );

  return leaderboard;
}
