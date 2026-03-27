// backend/src/controllers/user.controller.js
import User from "../models/User.model.js";
import Submission from "../models/Submission.model.js";
import Problem from "../models/Problem.model.js";
import { getISTDayKey } from "../utils/date.util.js";

// GET logged-in user's profile
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE logged-in user's profile
export const updateMe = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============ GET USER'S PROBLEM HISTORY ============ */
// Returns array: {date, problemId, solved, submissionId}
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all scheduled problems up to today (no future days)
    const todayIST = getISTDayKey(new Date());
    const problems = await Problem.find({ scheduledDayIST: { $lte: todayIST } })
      .select("_id scheduledDayIST title");

    // Fetch all this user's submissions (any status)
    const submissions = await Submission.find({ user: userId })
      .select("_id problem status createdAt");

    // Map: problemId string => accepted submissionId (if any), or last submissionId
    const bestSubByProblem = {};
    for (const sub of submissions) {
      const pid = sub.problem.toString();
      // Use first accepted, otherwise store latest
      if (sub.status === "Accepted" && !bestSubByProblem[pid]) {
        bestSubByProblem[pid] = sub._id;
      } else if (!bestSubByProblem[pid]) {
        bestSubByProblem[pid] = sub._id;
      }
    }

    // History calendar for this user
    const history = problems.map(prob => {
      const solved = bestSubByProblem[prob._id.toString()] ? true : false;
      const submissionId = bestSubByProblem[prob._id.toString()] || null;
      return {
        date: prob.scheduledDayIST,
        problemId: prob._id,
        problemTitle: prob.title,
        solved,
        submissionId
      };
    });

    res.status(200).json(history);
  } catch (error) {
     console.error('[USER HISTORY ERROR]',error);  
    res.status(500).json({ message: "Failed to fetch user history" });
  }
};