// backend/src/services/ollama/comparison.service.js
import BaseOllamaService from "./base.service.js";

class ComparisonService extends BaseOllamaService {
  constructor() {
    super();
  }

  /**
   * Compare two code submissions and provide AI insights
   */
  async compareCode(yourCode, theirCode, problemTitle, yourMetrics, theirMetrics) {
    const prompt = this.buildComparisonPrompt(
      yourCode,
      theirCode,
      problemTitle,
      yourMetrics,
      theirMetrics
    );

    console.log("📢 Sending comparison prompt to Ollama");
    const startTime = Date.now();

    const result = await this.generateCompletion(prompt);
    
    if (!result.success) {
      return {
        success: false,
        explanation: result.message
      };
    }

    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

    if (process.env.NODE_ENV !== 'production') {
      console.log("📢 Ollama comparison completed in", processingTime + "s");
    }

    return {
      success: true,
      explanation: result.response,
      processingTime: `${processingTime}s`,
      model: result.model
    };
  }

  /**
   * Build comparison prompt for Ollama
   */
  buildComparisonPrompt(yourCode, theirCode, problemTitle, yourMetrics, theirMetrics) {
    return `Compare these two solutions for: "${problemTitle}"

YOUR SOLUTION (Score: ${yourMetrics.score}/100):
Time: ${yourMetrics.executionTimeMs}ms | Memory: ${yourMetrics.memoryUsedKB}KB
Complexity: ${yourMetrics.complexity}

\`\`\`python
${yourCode}
\`\`\`

TOP SOLUTION (Score: ${theirMetrics.score}/100):
Time: ${theirMetrics.executionTimeMs}ms | Memory: ${theirMetrics.memoryUsedKB}KB
Complexity: ${theirMetrics.complexity}

\`\`\`python
${theirCode}
\`\`\`

Provide concise comparison (max 300 words):
1. Key algorithmic differences
2. Why top solution is faster/better
3. Specific improvements to make
4. Main learning point

Focus on actionable insights for a beginner.`;
  }
}

export default new ComparisonService();
