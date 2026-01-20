// backend/src/services/outputCheckers/unorderedChecker.js

export const unorderedChecker = (userOutput, expectedOutput) => {
  if (userOutput == null) return false;

  const userTokens = userOutput.trim().split(/\s+/).sort();
  const expectedTokens = expectedOutput.trim().split(/\s+/).sort();

  if (userTokens.length !== expectedTokens.length) return false;

  for (let i = 0; i < userTokens.length; i++) {
    if (userTokens[i] !== expectedTokens[i]) {
      return false;
    }
  }

  return true;
};
