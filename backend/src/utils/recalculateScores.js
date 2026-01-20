// backend/src/utils/recalculateScores.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Submission from "../models/Submission.model.js";

dotenv.config();

const calculateScore = (status, complexity, avgTime, avgMemory) => {
  if (status !== "Accepted") return 0;

  let score = 100;

  if (complexity === "O(n^2)") score -= 30;
  else if (complexity === "O(n log n)") score -= 10;
  else if (complexity === "Unknown") score -= 20;

  if (avgTime > 100) {
    score -= Math.min(20, (avgTime - 100) / 10);
  }

  if (avgMemory > 1000) {
    score -= Math.min(20, (avgMemory - 1000) / 100);
  }

  return Math.max(0, Math.round(score));
};

const recalculateScores = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const submissions = await Submission.find({ status: "Accepted" });
    console.log(`📊 Found ${submissions.length} accepted submissions\n`);

    let updatedCount = 0;

    for (const submission of submissions) {
      const avgTime = submission.metrics?.totalExecutionTimeMs || 0;
      const avgMemory = submission.metrics?.maxMemoryUsedKB || 0;
      const complexity = submission.performance?.inferredComplexity || "Unknown";

      const newScore = calculateScore("Accepted", complexity, avgTime, avgMemory);

      if (submission.score !== newScore) {
        const oldScore = submission.score || 0;
        submission.score = newScore;
        await submission.save();
        
        console.log(`✅ Updated ${submission._id}: ${oldScore} → ${newScore}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped ${submission._id}: unchanged (${newScore})`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Updated ${updatedCount} submissions!`);
    console.log(`⏭️  Skipped ${submissions.length - updatedCount} submissions`);
    console.log("=".repeat(50) + "\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error recalculating scores:", error);
    process.exit(1);
  }
};

recalculateScores();