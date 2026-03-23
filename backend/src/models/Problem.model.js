// backend/src/models/Problem.model.js
import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  size: {                           // ← ADD THIS!
    type: String,
    enum: ["small", "medium", "large"],
    default: "small"
  }
});

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },
    constraints: {
      type: String
    },
    testCases: [testCaseSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    scheduledDate: {
      type: Date,
      required: false
    },
    scheduledDayIST: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      match: /^\d{4}-\d{2}-\d{2}$/
    }
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);