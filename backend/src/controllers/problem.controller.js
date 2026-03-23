/*backend/src/controllers/problem.controller.js*/
import Problem from "../models/Problem.model.js";
import { getISTDayKey } from "../utils/date.util.js";

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

/* ================= GET ALL PROBLEMS (USER) ================= */
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select(
      "title difficulty constraints createdAt scheduledDate scheduledDayIST"
    );

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};
/* ================= GET SINGLE PROBLEM (USER) ================= */
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Filter out hidden test cases
    const visibleTestCases = problem.testCases.filter(
      (tc) => !tc.isHidden
    );

    res.status(200).json({
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      constraints: problem.constraints,
      testCases: visibleTestCases,
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

    // Handle scheduling fields (Option A: allow updates to schedule)
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
      createdAt: problem.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's problem" });
  }
};
