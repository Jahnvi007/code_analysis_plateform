// src/models/Comparison.model.js
import mongoose from "mongoose";

const comparisonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userSubmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true
    },
    compareWithSubmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true
    },
    
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    aiAnalysis: {
      type: String,
      default: "AI analysis pending..."
    },
    lineDifferences: [
      {
        lineNumber: Number,
        yourLine: String,
        theirLine: String,
        type: {
          type: String,
          enum: ["added", "removed", "modified", "same"]
        }
      }
    ],
    performanceComparison: {
      timeImprovement: String,
      memoryImprovement: String,
      scoreGap: Number
    },
    insights: [
      {
        category: {
          type: String,
          enum: ["algorithm", "complexity", "optimization", "style"]
        },
        message: String,
        impact: {
          type: String,
          enum: ["high", "medium", "low"]
        }
      }
    ]
  },
  { timestamps: true }
);

comparisonSchema.index({ user: 1, problem: 1, createdAt: -1 });

export default mongoose.model("Comparison", comparisonSchema);