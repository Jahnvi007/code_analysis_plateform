//backend/src/models/Submission.model.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ["python"],
      required: true
    },
status: {
  type: String,
  enum: [
    "Pending",
    "Accepted",
    "Wrong Answer",
    "Time Limit Exceeded",
    "Runtime Error",
    "Compilation Error",
    "Rejected" // 🔥 ADD THIS
  ],
  default: "Pending"
},

    results: [// Update results array to include memory:

  {
    input: String,
    expectedOutput: String,
    userOutput: String,
    isHidden: Boolean,
    passed: Boolean,
    executionTimeMs: Number,
    memoryUsedKB: Number  // ← ADD THIS
  }
],

    metrics: {
      totalExecutionTimeMs: {
        type: Number,
        default: 0
      },
      maxMemoryUsedKB: {    // ← ADD THIS
    type: Number,
    default: 0
  }
    },
    performance: {
  executionTimes: {
    small: Number,
    medium: Number,
    large: Number
  },
  inferredComplexity: {
    type: String,
    enum: ["O(n)", "O(n log n)", "O(n^2)", "Unknown"]
  },
  
  complexityScore: Number
},

//Add score field:
score: {              // ← ADD THIS
  type: Number,
  default: 0
},
rejectionReason: {
  type: String,
  default: null
},
performanceAnalysis: {
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
  explanation: { type: String },
  bottlenecks: [{ type: String }],
  optimizationSuggestions: [{ type: String }],
  generatedAt: { type: Date }
}


  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);


