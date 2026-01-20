// backend/src/services/outputCheckers/textChecker.js

/**
 * Normalize output:
 * - trim spaces
 * - normalize newlines
 * - remove trailing spaces per line
 */
const normalize = (str) => {
  return str
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(line => line.trimEnd())
    .join("\n")
    .trim();
};

export const textChecker = (userOutput, expectedOutput) => {
  if (userOutput == null) return false;

  return normalize(userOutput) === normalize(expectedOutput);
};
