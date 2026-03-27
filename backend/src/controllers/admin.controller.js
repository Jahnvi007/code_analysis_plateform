// backend/src/controllers/admin.controller.js
import Problem from "../models/Problem.model.js";
import User from "../models/User.model.js";
import Submission from "../models/Submission.model.js";
import { getISTDayKey } from "../utils/date.util.js";

/* ========== GET PROBLEM QUEUE: all problems, with status ========== */
export const getProblemQueue = async (req, res) => {
  try {
    const todayIST = getISTDayKey(new Date());
    const problems = await Problem.find().sort({ scheduledDayIST: 1 });

    // Add status for each (past/today/future)
    const response = problems.map(prob => {
      let status;
      if (prob.scheduledDayIST === todayIST) status = "today";
      else if (prob.scheduledDayIST < todayIST) status = "past";
      else status = "future";
      return {
        _id: prob._id,
        title: prob.title,
        scheduledDate: prob.scheduledDate,
        scheduledDayIST: prob.scheduledDayIST,
        status,
        difficulty: prob.difficulty,
        createdAt: prob.createdAt,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Failed to load problem queue" });
  }
};

/* ========== GET ALL USERS, WITH ROLES AND SOLVED COUNTS ========== */
export const getAllUsersWithStats = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role createdAt");

    // Count ACCEPTED submissions per user
    const stats = await Submission.aggregate([
      { $match: { status: "Accepted" } },
      { $group: { _id: "$user", solvedCount: { $sum: 1 } } }
    ]);
    const solvedMap = {};
    stats.forEach(row => { solvedMap[row._id.toString()] = row.solvedCount; });

    const result = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      solvedCount: solvedMap[user._id.toString()] || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user stats" });
  }
};

/* ========== GET ALL SUBMISSIONS (OPTIONAL, for admin panel/table) ========== */
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("problem", "title scheduledDayIST");
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to load submissions" });
  }
};