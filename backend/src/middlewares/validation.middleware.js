//backend/src/middlewares/validation.middleware.js

// ─── Auth validators ────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "A valid email address is required" });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "A valid email address is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  next();
};

// ─── Submission validator ────────────────────────────────────────────────────

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

  // Validate scheduledDate if provided (optional field)
  if ("scheduledDate" in req.body && req.body.scheduledDate !== null) {
    if (isNaN(Date.parse(req.body.scheduledDate))) {
      return res.status(400).json({
        message: "scheduledDate must be a valid date string"
      });
    }
  }

  next();
};