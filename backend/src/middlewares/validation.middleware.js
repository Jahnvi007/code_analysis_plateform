//backend/src/middlewares/validation.middleware.js
export const validateSubmission = (req, res, next) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({
      message: "Missing required fields: problemId, code, language"
    });
  }

  if (code.length > 50000) {
    return res.status(400).json({
      message: "Code too long (max 50KB)"
    });
  }

  if (language !== "python") {
    return res.status(400).json({
      message: "Only Python supported currently"
    });
  }

  next();
};

export const validateComparison = (req, res, next) => {
  const { yourSubmissionId, compareWithSubmissionId } = req.body;

  if (!yourSubmissionId || !compareWithSubmissionId) {
    return res.status(400).json({
      message: "Both submission IDs required"
    });
  }

  if (yourSubmissionId === compareWithSubmissionId) {
    return res.status(400).json({
      message: "Cannot compare submission with itself"
    });
  }

  next();
};

// ⬇️ ADD THIS NEW EXPORT:
export const validateProblem = (req, res, next) => {
  const { title, description, difficulty, testCases } = req.body;

  if (!title || !description || !difficulty) {
    return res.status(400).json({
      message: "Missing required fields: title, description, difficulty"
    });
  }

  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({
      message: "At least one test case is required"
    });
  }

  // Validate each test case
  for (const testCase of testCases) {
    if (!testCase.input || !testCase.output || !testCase.size) {
      return res.status(400).json({
        message: "Each test case must have: input, output, size"
      });
    }

    if (!["small", "medium", "large"].includes(testCase.size)) {
      return res.status(400).json({
        message: "Test case size must be: small, medium, or large"
      });
    }
  }

  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({
      message: "Difficulty must be: easy, medium, or hard"
    });
  }

  next();
};