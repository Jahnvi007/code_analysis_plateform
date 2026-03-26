// src/controllers/submission.controller.js
import Submission from "../models/Submission.model.js";
import Problem from "../models/Problem.model.js";
import { runPythonCode } from "../services/codeRunner.service.js";
import { checkOutput } from "../services/outputCheckers/index.js";
import { validatePythonCode } from "../services/sandbox/pythonSandbox.js";
import { wrapPythonCode } from "../utils/pythonWrapper.js";
import { calculateProblemScore } from "../utils/score.util.js";
import PerformanceAnalysisService from "../services/performanceAnalysis.service.js";
import ExplanationService from "../services/ai/explanation.service.js";
import { parsePagination } from "../utils/pagination.util.js";

/* ------------------- SUBMIT CODE ------------------- */
export const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    if (!problemId || !code || !language) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      language,
      status: "Pending",
      results: []
    });

    let finalVerdict = "Accepted";
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;

    // 1️⃣ Run all test cases
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      const wrappedCode = wrapPythonCode(code, testCase.input);
      const validation = validatePythonCode(wrappedCode);
      if (!validation.allowed) {
        submission.status = "Rejected";
        submission.rejectionReason = validation.reason;
        await submission.save();

        return res.status(200).json({
          verdict: "Rejected",
          reason: validation.reason,
          submissionId: submission._id
        });
      }

      const execution = await runPythonCode(wrappedCode);
      totalExecutionTime += execution.executionTimeMs;
      maxMemoryUsed = Math.max(maxMemoryUsed, execution.memoryUsedKB);

      const passed = checkOutput(
        execution.output,
        testCase.output,
        problem.outputMeta || {}
      );

      submission.results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        userOutput: execution.output,
        isHidden: testCase.isHidden,
        passed,
        executionTimeMs: execution.executionTimeMs,
        memoryUsedKB: execution.memoryUsedKB
      });

      if (!passed) finalVerdict = "Wrong Answer";
    }

    // 2️⃣ Save metrics
    submission.metrics = {
      totalExecutionTimeMs: totalExecutionTime,
      maxMemoryUsedKB: maxMemoryUsed
    };

    // 3️⃣ Score calculation if Accepted
    if (finalVerdict === "Accepted") {
      const problemDifficulty = problem.difficulty;

      // Fetch best benchmarks
      const bestSubmission = await Submission.findOne({
        problem: problemId,
        status: "Accepted"
      })
        .sort({
          "metrics.totalExecutionTimeMs": 1,
          "metrics.maxMemoryUsedKB": 1
        })
        .select("metrics.totalExecutionTimeMs metrics.maxMemoryUsedKB");

      const bestTime = bestSubmission?.metrics?.totalExecutionTimeMs || totalExecutionTime;
      const bestMemory = bestSubmission?.metrics?.maxMemoryUsedKB || maxMemoryUsed;

      const score = calculateProblemScore({
        verdict: finalVerdict,
        userTime: totalExecutionTime,
        bestTime,
        userMemory: maxMemoryUsed,
        bestMemory,
        difficulty: problemDifficulty
      });

      submission.score = Number.isFinite(score) ? score : 0;

      // 4️⃣ Performance analysis via AI
      const analysis = await PerformanceAnalysisService.analyzeSubmission(submission);

      submission.performanceAnalysis = {
        ...analysis,
        generatedAt: new Date()
      };
    }

    submission.status = finalVerdict;
    await submission.save();

    return res.status(200).json({
      verdict: finalVerdict,
      submission
    });
  } catch (error) {
    console.error("Submission error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* ------------------- EXPLAIN SUBMISSION ------------------- */
export const explainSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id).populate("problem");
    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

    // 🚨 Ownership check
    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Call AI explanation service
    const aiResult = await ExplanationService.explainSubmission({
      problemTitle: submission.problem.title,
      problemStatement: submission.problem.statement,
      testResults: submission.results,
      userCode: submission.code,
      verdict: submission.status,
      language: submission.language
    });

    // Handle AI service failure
    if (!aiResult.success) {
      return res.status(503).json({
        success: false,
        message: "AI explanation unavailable",
        error: aiResult.error,
        details: aiResult.explanation || "Please try again later."
      });
    }

    return res.status(200).json({
      success: true,
      explanation: aiResult.explanation
    });
  } catch (error) {
    console.error("❌ EXPLAIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to generate explanation" });
  }
};

/* ------------------- GET MY SUBMISSIONS ------------------- */
export const getMySubmissions = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, 20);

    const [submissions, total] = await Promise.all([
      Submission.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Submission.countDocuments({ user: req.user.id })
    ]);

    res.status(200).json({
      data: submissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};

/* ------------------- GET SUBMISSION BY ID ------------------- */
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    // 🚨 Ownership check
    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submission" });
  }
};