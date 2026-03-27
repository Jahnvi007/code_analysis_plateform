// backend/src/controllers/problem.controller.js
import Problem from "../models/Problem.model.js";
import { getISTDayKey } from "../utils/date.util.js";
import { parsePagination } from "../utils/pagination.util.js";
import User from '../models/User.model.js';
import Submission from '../models/Submission.model.js';
/* ================= CREATE PROBLEM (ADMIN) ================= */
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, constraints, testCases, scheduledDate } = req.body;

    if (!title || !description || !difficulty || !testCases) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const problemData = {
      title,
      description,
      difficulty,
      constraints,
      testCases,
      createdBy: req.user._id
    };

    if (scheduledDate != null) {
      const parsedDate = new Date(scheduledDate);
      problemData.scheduledDate = parsedDate;
      problemData.scheduledDayIST = getISTDayKey(parsedDate);
    }

    const problem = await Problem.create(problemData);

    res.status(201).json({
      message: "Problem created successfully",
      problemId: problem._id
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.scheduledDayIST) {
      const day = error.keyValue && error.keyValue.scheduledDayIST;
      return res.status(409).json({
        message: `A problem is already scheduled for IST date: ${day}`
      });
    }
    res.status(500).json({ message: "Problem creation failed" });
  }
};

/* ================= GET ALL PROBLEMS (USER/ADMIN) ================= */
export const getAllProblems = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 10);
    const { status } = req.query; // status = past/today/future

    // Compute today's IST dayKey
    const todayIST = getISTDayKey(new Date());

    // Filter by scheduledDayIST if needed
    let match = {};
    if (status === "past") match.scheduledDayIST = { $lt: todayIST };
    if (status === "today") match.scheduledDayIST = todayIST;
    if (status === "future") match.scheduledDayIST = { $gt: todayIST };

    const [problems, total] = await Promise.all([
      Problem.find(match)
        .select("title difficulty constraints createdAt scheduledDate scheduledDayIST")
        .sort({ scheduledDayIST: -1 })
        .skip(skip)
        .limit(limit),
      Problem.countDocuments(match)
    ]);

    // Tag each with "isExpired"
    const withExpiry = problems.map(prob => ({
      ...prob.toObject(),
      isExpired: prob.scheduledDayIST < todayIST
    }));

    res.status(200).json({
      data: withExpiry,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

/* ================= GET SINGLE PROBLEM (USER/ADMIN) ================= */
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Only show visible/allowed test cases to users
    const visibleTestCases = problem.testCases.filter(
      (tc) => !tc.isHidden
    );

    // Compute isExpired
    const todayIST = getISTDayKey(new Date());
    const isExpired = problem.scheduledDayIST < todayIST;

    res.status(200).json({
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      testCases: visibleTestCases,
      scheduledDate: problem.scheduledDate,
      scheduledDayIST: problem.scheduledDayIST,
      isExpired,
      createdAt: problem.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch problem" });
  }
};

/* ================= UPDATE PROBLEM (ADMIN) ================= */
export const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Optional: only creator/admin can update
    const { scheduledDate, ...otherFields } = req.body;
    Object.assign(problem, otherFields);

    // Handle scheduling fields
    if ("scheduledDate" in req.body) {
      if (scheduledDate == null) {
        // Explicitly unschedule
        problem.scheduledDate = undefined;
        problem.scheduledDayIST = undefined;
      } else {
        const parsedDate = new Date(scheduledDate);
        problem.scheduledDate = parsedDate;
        problem.scheduledDayIST = getISTDayKey(parsedDate);
      }
    }

    await problem.save();

    res.status(200).json({
      message: "Problem updated successfully",
      problem
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.scheduledDayIST) {
      const day = error.keyValue && error.keyValue.scheduledDayIST;
      return res.status(409).json({
        message: `A problem is already scheduled for IST date: ${day}`
      });
    }
    res.status(500).json({ message: "Problem update failed" });
  }
};

/* ================= DELETE PROBLEM (ADMIN) ================= */
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await problem.deleteOne();

    res.status(200).json({
      message: "Problem deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Problem deletion failed" });
  }
};

/* ================= GET TODAY'S PROBLEM (USER) ================= */
export const getTodayProblem = async (req, res) => {
  try {
    const todayIST = getISTDayKey(new Date());

    const problem = await Problem.findOne({ scheduledDayIST: todayIST });

    if (!problem) {
      return res.status(404).json({
        message: `No problem scheduled for today (${todayIST} IST)`
      });
    }

    // Filter out hidden test cases (consistent with getProblemById)
    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);

    res.status(200).json({
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      testCases: visibleTestCases,
      scheduledDate: problem.scheduledDate,
      scheduledDayIST: problem.scheduledDayIST,
      isExpired: false, // today's problem is never expired
      createdAt: problem.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's problem" });
  }
};

export const getSolvedUsersForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    // 1. Get the problem's scheduledDate
    const problem = await Problem.findById(problemId).select('scheduledDate title');
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // 2. Get all accepted submissions for that problem, ordered by submission time
    const subs = await Submission.find({
      problem: problemId,
      status: "Accepted"
    }).sort({ createdAt: 1 });

    // 3. Map userId => first solved timestamp
    const userFirstSolvedMap = new Map();
    subs.forEach(sub => {
      const uid = sub.user.toString();
      if (!userFirstSolvedMap.has(uid)) {
        userFirstSolvedMap.set(uid, sub.createdAt);
      }
    });

    // 4. Fetch user data
    const users = await User.find({ _id: { $in: Array.from(userFirstSolvedMap.keys()) } }).select('name');

    // 5. Build leaderboard data
    const leaderboard = users.map(user => {
      const solvedAt = userFirstSolvedMap.get(user._id.toString());
      const timeToSolveMs = new Date(solvedAt) - new Date(problem.scheduledDate);
      return {
        name: user.name,
        firstSolvedAt: solvedAt,
        timeToSolveMs,
        // Extra: readable format, e.g. "3m 15s"
        timeToSolveFormatted: msToMinutesAndSeconds(timeToSolveMs)
      };
    });

    // 6. Sort fastest solvers first
    leaderboard.sort((a, b) => a.timeToSolveMs - b.timeToSolveMs);

    res.json({
      success: true,
      problem: {
        title: problem.title,
        scheduledDate: problem.scheduledDate
      },
      totalSolved: leaderboard.length,
      leaderboard
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching leaderboard" });
  }
};

// Helper to format ms as "3m 05s"
function msToMinutesAndSeconds(ms) {
  if (isNaN(ms) || ms < 0) return "--";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}