export { generateOptimizationFeedback };
/**
 * Compare two submissions' analysis and explain what the user is missing compared to the optimized solution.
 *
 * @param {object} yourSub - The less optimized submission object
 * @param {object} betterSub - The more optimized submission object
 * @returns {string} Actionable feedback
 */
function generateOptimizationFeedback(yourSub, betterSub) {
  let feedback = [];

  // 1. Check Time Complexity
  if (
    yourSub.performanceAnalysis?.timeComplexity &&
    betterSub.performanceAnalysis?.timeComplexity &&
    yourSub.performanceAnalysis.timeComplexity !== betterSub.performanceAnalysis.timeComplexity
  ) {
    feedback.push(
      `Your code has **${yourSub.performanceAnalysis.timeComplexity}** time complexity, ` +
      `but the top solution achieves **${betterSub.performanceAnalysis.timeComplexity}**.`
    );
  }

  // 2. Space Complexity
  if (
    yourSub.performanceAnalysis?.spaceComplexity &&
    betterSub.performanceAnalysis?.spaceComplexity &&
    yourSub.performanceAnalysis.spaceComplexity !== betterSub.performanceAnalysis.spaceComplexity
  ) {
    feedback.push(
      `Your code uses **${yourSub.performanceAnalysis.spaceComplexity}** space, ` +
      `while the top solution uses **${betterSub.performanceAnalysis.spaceComplexity}**.`
    );
  }

  // 3. Bottlenecks
  if (yourSub.performanceAnalysis?.bottlenecks?.length) {
    feedback.push("**Possible inefficiencies in your code:**");
    yourSub.performanceAnalysis.bottlenecks.forEach(b => feedback.push("- " + b));
  }

  // 4. Optimization Suggestions unique to betterSub
  if (
    Array.isArray(betterSub.performanceAnalysis?.optimizationSuggestions) &&
    betterSub.performanceAnalysis.optimizationSuggestions.length > 0
  ) {
    feedback.push("**Tips from the top solution's analysis:**");
    betterSub.performanceAnalysis.optimizationSuggestions.forEach(
      tip => feedback.push("- " + tip)
    );
  }

  // 5. Show code structure difference
  // (You can make this smarter by AST or regex, here’s a simple string check)
  if (
    betterSub.code.includes("set(") && !yourSub.code.includes("set(")
  ) {
    feedback.push("The optimized solution uses a set for fast lookups, which your code does not.");
  }
  if (
    betterSub.code.includes("{") && !yourSub.code.includes("{")
  ) {
    feedback.push("The optimized solution may use a hash map (dictionary) for efficiency, which your code does not.");
  }

  // 6. Execution time/score (optional)
  if (
    (yourSub.metrics?.totalExecutionTimeMs || 0) > (betterSub.metrics?.totalExecutionTimeMs || 0)
  ) {
    feedback.push(
      `Your code ran in ${yourSub.metrics.totalExecutionTimeMs} ms, while the optimized one ran in only ${betterSub.metrics.totalExecutionTimeMs} ms.`
    );
  }

  // 7. If nothing to say:
  if (feedback.length === 0) {
    feedback.push("Your code is already as optimal as the top solution—great job!");
  }

  return feedback.join("\n");
}