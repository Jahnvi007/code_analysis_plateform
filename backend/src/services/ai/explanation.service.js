// backend/src/services/ai/explanation.service.js

import BaseOllamaService from "../ollama/base.service.js";

class ExplanationService extends BaseOllamaService {
  constructor() {
    super();
  }

  async explainSubmission({
    problemTitle,
    problemStatement,
    testResults,
    userCode,
    verdict,
    language
  }) {
    const prompt = this.buildPrompt({
      problemTitle,
      problemStatement,
      testResults,
      userCode,
      verdict,
      language
    });

    console.log("🦙 Sending explanation prompt to Ollama");

    const result = await this.generateCompletion(prompt);

    if (!result.success) {
      console.error("❌ OLLAMA ERROR:", result.error);
      return {
        success: false,
        explanation: result.message || "AI service is temporarily unavailable. Please try again later."
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log("🦙 Ollama explanation completed successfully");
    }

    return {
      success: true,
      explanation: result.response || "AI did not return an explanation."
    };
  }

  buildPrompt({
    problemTitle,
    problemStatement,
    testResults,
    userCode,
    verdict,
    language
  }) {
    return `
You are an expert competitive programming mentor.

Problem:
${problemTitle}

Submission verdict: ${verdict}

Observed execution details:
${JSON.stringify(testResults, null, 2)}

User submitted code (${language}):
${userCode}

Your task:
- Explain WHY this submission resulted in ${verdict}
- Focus on the root cause (logic / performance / memory / crash)
- Refer to test case behavior if relevant
- Suggest how to fix the issue CONCEPTUALLY
- Suggest a better approach in plain words

STRICT RULES:
- ❌ Do NOT write code
- ❌ Do NOT show implementation
- ❌ Do NOT use code blocks
- ✅ Explain in bullets
- ✅ Beginner-friendly
- ✅ Max 200 words
`;
  }
}

export default new ExplanationService();
