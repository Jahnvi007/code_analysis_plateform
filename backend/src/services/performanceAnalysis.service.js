// src/services/performanceAnalysis.service.js
import BaseOllamaService from "./ollama/base.service.js";

class PerformanceAnalysisService extends BaseOllamaService {
  constructor() {
    super();
  }

  /**
   * Analyze a single submission
   * @param {Object} submission - MongoDB submission document
   */
  async analyzeSubmission(submission) {
    if (!submission) throw new Error("Submission is required");

    const { code, language, metrics } = submission;
    const prompt = `Analyze the following ${language} code for:
1. Time complexity
2. Space complexity
3. Bottlenecks
4. Optimization suggestions

Code:
\`\`\`${language}
${code}
\`\`\`

Metrics:
ExecutionTimeMs: ${metrics?.totalExecutionTimeMs || 0}
MemoryUsedKB: ${metrics?.maxMemoryUsedKB || 0}

Provide concise analysis with actionable suggestions.`;

    const result = await this.generateCompletion(prompt);

    if (!result.success) {
      return {
        timeComplexity: "Unknown",
        spaceComplexity: "Unknown",
        explanation: "Failed to analyze code",
        bottlenecks: [],
        optimizationSuggestions: []
      };
    }

    return {
      timeComplexity: "Unknown", // Parse from result.response if needed
      spaceComplexity: "Unknown", // Parse from result.response if needed
      explanation: result.response || "",
      bottlenecks: [],
      optimizationSuggestions: []
    };
  }
}

export default new PerformanceAnalysisService();
