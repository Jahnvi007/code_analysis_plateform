// src/controllers/comparison.controller.js
import Submission from "../models/Submission.model.js";
import Comparison from "../models/Comparison.model.js";
import ComparisonService from "../services/ollama/comparison.service.js";
import { diffLines } from 'diff';

export const compareSubmissions = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    // 1️⃣ Fetch user's submission
    const yourSubmission = await Submission.findById(submissionId)
      .populate("problem", "title");

    if (!yourSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // 2️⃣ Ownership check
    if (yourSubmission.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not your submission" });
    }

    // 3️⃣ Accepted-only rule
    if (yourSubmission.status !== "Accepted") {
      return res.status(400).json({
        message: "Comparison allowed only for Accepted submissions"
      });
    }

    // 4️⃣ Find Top 10% solution (same problem)
    const topSubmission = await Submission.findOne({
      problem: yourSubmission.problem._id,
      status: "Accepted",
      _id: { $ne: yourSubmission._id }
    })
      .sort({ score: -1, "metrics.totalExecutionTimeMs": 1 });

    if (!topSubmission) {
      return res.status(404).json({
        message: "No top solution available yet"
      });
    }

    // 5️⃣ Daily limit (3/day)
    const todayCount = await Comparison.countDocuments({
      user: userId,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    if (todayCount >= 3) {
      return res.status(429).json({
        message: "Daily comparison limit reached"
      });
    }

    // 6️⃣ Cached comparison
    const cached = await Comparison.findOne({
      userSubmission: yourSubmission._id,
      compareWithSubmission: topSubmission._id
    });

    if (cached) {
      return res.json({ cached: true, comparison: cached });
    }

    // 7️⃣ AI Comparison
    const aiResult = await ComparisonService.compareCode(
      yourSubmission.code,
      topSubmission.code,
      yourSubmission.problem.title,
      {
        score: yourSubmission.score,
        executionTimeMs: yourSubmission.metrics?.totalExecutionTimeMs || 0,
        memoryUsedKB: yourSubmission.metrics?.maxMemoryUsedKB || 0,
        complexity: yourSubmission.performance?.inferredComplexity || "Unknown"
      },
      {
        score: topSubmission.score,
        executionTimeMs: topSubmission.metrics?.totalExecutionTimeMs || 0,
        memoryUsedKB: topSubmission.metrics?.maxMemoryUsedKB || 0,
        complexity: topSubmission.performance?.inferredComplexity || "Unknown"
      }
    );

    // Handle AI service failure
    if (!aiResult.success) {
      return res.status(503).json({
        message: "AI service temporarily unavailable",
        error: aiResult.error,
        details: aiResult.explanation || "Please try again later."
      });
    }

    // 8️⃣ Save comparison
    const comparison = await Comparison.create({
      user: userId,
      userSubmission: yourSubmission._id,
      compareWithSubmission: topSubmission._id,
      problem: yourSubmission.problem._id,
      aiAnalysis: aiResult.explanation,
      performanceComparison: {
        scoreGap: topSubmission.score - yourSubmission.score
      }
    });

    return res.json({
      message: "Comparison generated",
      comparison
    });

  } catch (err) {
    console.error("Comparison error:", err);
    res.status(500).json({ message: "Comparison failed" });
  }
};


export const getMyComparisons = async (req, res) => {
  try {
    const comparisons = await Comparison.find({ user: req.user._id })
      .populate('problem', 'title difficulty')
      .populate('compareWithUser', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ comparisons });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comparisons" });
  }
};

export const getTopSolutions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const topSubmissions = await Submission.find({
      problem: problemId,
      status: "Accepted"
    })
      .populate('user', 'name')
      .sort({ score: -1, 'metrics.totalExecutionTimeMs': 1 })
      .limit(limit)
      .select('user status score metrics performance createdAt');

    res.status(200).json({ topSubmissions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top solutions" });
  }
};

// Helper functions
function generateDiff(code1, code2) {
  const differences = diffLines(code1, code2);
  const result = [];
  let lineNum = 1;

  for (const part of differences) {
    if (part.added || part.removed) {
      result.push({
        lineNumber: lineNum,
        yourLine: part.removed ? part.value : '',
        theirLine: part.added ? part.value : '',
        type: part.added ? 'added' : 'removed'
      });
    }
    lineNum += part.value.split('\n').length - 1;
  }

  return result.slice(0, 20);
}

function calculateImprovement(yours, theirs) {
  if (theirs === 0) return "N/A";
  const diff = ((yours / theirs) - 1) * 100;
  if (Math.abs(diff) < 1) return "Similar";
  return diff > 0 ? `${diff.toFixed(1)}% slower` : `${Math.abs(diff).toFixed(1)}% faster`;
}

function extractInsights(text) {
  const insights = [];
  const lower = text.toLowerCase();

  if (lower.includes('nested loop') || lower.includes('o(n²)')) {
    insights.push({
      category: 'complexity',
      message: 'Avoid nested loops for better time complexity',
      impact: 'high'
    });
  }

  if (lower.includes('hash') || lower.includes('dictionary')) {
    insights.push({
      category: 'optimization',
      message: 'Use hash map for O(1) lookups',
      impact: 'high'
    });
  }

  if (lower.includes('space') || lower.includes('memory')) {
    insights.push({
      category: 'complexity',
      message: 'Consider space-time tradeoff',
      impact: 'medium'
    });
  }

  return insights;
}