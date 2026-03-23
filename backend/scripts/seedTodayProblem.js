/**
 * seedTodayProblem.js
 *
 * Inserts (or replaces) a unique daily problem scheduled for TODAY (IST) into
 * the database.  Run with:
 *
 *   npm run seed:today
 *
 * Safe to re-run: if a problem already exists for today's IST date, the old
 * one is removed first so the fresh unique problem takes its place.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { getISTDayKey } from "../src/utils/date.util.js";
import Problem from "../src/models/Problem.model.js";

dotenv.config();

/* ─────────────────────────────────────────────────────────────────────────── *
 *  UNIQUE DAILY PROBLEM – "Longest Substring Without Repeating Characters"   *
 *  Uses a sliding-window approach that is distinct from the common Two-Sum /  *
 *  Reverse-Array / FizzBuzz problems that are usually already in the DB.      *
 * ─────────────────────────────────────────────────────────────────────────── */
const todayIST = getISTDayKey(new Date());

const UNIQUE_PROBLEM = {
  title: `Daily Challenge ${todayIST}: Longest Substring Without Repeating Characters`,
  description:
    "Given a string s, find the length of the longest substring that contains no repeating characters.\n\n" +
    "Input format (single line): the string s (1 ≤ |s| ≤ 10^4, only printable ASCII)\n" +
    "Output format (single line): a single integer — the length of the longest such substring.\n\n" +
    "Example:\n  Input:  abcabcbb\n  Output: 3   (the window 'abc')\n\n" +
    "Example:\n  Input:  bbbbb\n  Output: 1   (the window 'b')\n\n" +
    "Example:\n  Input:  pwwkew\n  Output: 3   (the window 'wke')",
  difficulty: "medium",
  constraints:
    "1 ≤ |s| ≤ 10^4\n" +
    "s consists of printable ASCII characters.\n" +
    "Time limit: 2 s | Memory limit: 256 MB",
  testCases: [
    // ── visible ──────────────────────────────────────────────────────────
    { input: "abcabcbb", output: "3", isHidden: false, size: "small" },
    { input: "bbbbb",    output: "1", isHidden: false, size: "small" },
    { input: "pwwkew",   output: "3", isHidden: false, size: "small" },
    // ── hidden (judge) ────────────────────────────────────────────────────
    { input: " ",        output: "1", isHidden: true,  size: "small" },
    { input: "au",       output: "2", isHidden: true,  size: "small" },
    {
      input: "dvdf",
      output: "3",
      isHidden: true,
      size: "medium"
    },
    {
      // 26-char string with all unique chars → answer is 26
      input: "abcdefghijklmnopqrstuvwxyz",
      output: "26",
      isHidden: true,
      size: "medium"
    },
    {
      // longer repeating pattern
      input: "aab",
      output: "2",
      isHidden: true,
      size: "small"
    },
    {
      // large: repeated alphabet blocks
      input: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
      output: "26",
      isHidden: true,
      size: "large"
    }
  ],
  scheduledDayIST: todayIST,
  scheduledDate: new Date(`${todayIST}T00:00:00+05:30`)
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Remove any existing problem for today so we get a clean slate
    const removed = await Problem.deleteOne({ scheduledDayIST: todayIST });
    if (removed.deletedCount > 0) {
      console.log(
        `🗑️  Removed previous problem scheduled for ${todayIST} IST`
      );
    }

    const problem = await Problem.create(UNIQUE_PROBLEM);

    console.log("\n🎉 Today's problem seeded successfully!");
    console.log(`   _id            : ${problem._id}`);
    console.log(`   title          : ${problem.title}`);
    console.log(`   difficulty     : ${problem.difficulty}`);
    console.log(`   scheduledDayIST: ${problem.scheduledDayIST}`);
    console.log(`   test cases     : ${problem.testCases.length} (${
      problem.testCases.filter((t) => !t.isHidden).length
    } visible, ${
      problem.testCases.filter((t) => t.isHidden).length
    } hidden)`);
    console.log("\n➡️  Now hit GET /api/problems/today to fetch it.\n");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
