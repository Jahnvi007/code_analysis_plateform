// backend/src/services/outputCheckers/index.js

import { textChecker } from "./textChecker.js";
import { numberChecker } from "./numberChecker.js";
import { unorderedChecker } from "./unorderedChecker.js";

/**
 * Main output checker dispatcher
 * @param {string} userOutput
 * @param {string} expectedOutput
 * @param {string} type - optional (text | number | unordered)
 */
export const checkOutput = (
  userOutput,
  expectedOutput,
  type = "text"
) => {
  switch (type) {
    case "number":
      return numberChecker(userOutput, expectedOutput);

    case "unordered":
      return unorderedChecker(userOutput, expectedOutput);

    case "text":
    default:
      return textChecker(userOutput, expectedOutput);
  }
};
