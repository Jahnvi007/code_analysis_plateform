//backend/src/utils/constants.js
export const STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  RUNTIME_ERROR: "Runtime Error",
  TIMEOUT: "Timeout"
};

export const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
};

export const COMPLEXITY = {
  CONSTANT: "O(1)",
  LOGARITHMIC: "O(log n)",
  LINEAR: "O(n)",
  LINEARITHMIC: "O(n log n)",
  QUADRATIC: "O(n^2)",
  CUBIC: "O(n^3)",
  UNKNOWN: "Unknown"
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin"
};