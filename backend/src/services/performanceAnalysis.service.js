// src/services/performanceAnalysis.service.js
import OllamaService from "./ollama.service.js";

class PerformanceAnalysisService {
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

    const result = await OllamaService.generate({
      prompt,
      model: "qwen2.5-coder:7b",
      stream: false
    });

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
      timeComplexity: result.timeComplexity || "Unknown",
      spaceComplexity: result.spaceComplexity || "Unknown",
      explanation: result.explanation || "",
      bottlenecks: result.bottlenecks || [],
      optimizationSuggestions: result.optimizationSuggestions || []
    };
  }
}

export default new PerformanceAnalysisService();
