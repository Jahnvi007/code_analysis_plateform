// backend/src/services/outputCheckers/numberChecker.js

const EPSILON = 1e-6;

export const numberChecker = (userOutput, expectedOutput) => {
  if (userOutput == null) return false;

  const userNums = userOutput.trim().split(/\s+/).map(Number);
  const expectedNums = expectedOutput.trim().split(/\s+/).map(Number);

  if (userNums.length !== expectedNums.length) return false;

  for (let i = 0; i < userNums.length; i++) {
    if (Number.isNaN(userNums[i]) || Number.isNaN(expectedNums[i])) {
      return false;
    }
    if (Math.abs(userNums[i] - expectedNums[i]) > EPSILON) {
      return false;
    }
  }

  return true;
};
