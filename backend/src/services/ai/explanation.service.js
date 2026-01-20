// backend/src/services/ai/explanation.service.js

import { OLLAMA_CONFIG } from "../../config/ollama.js";

class ExplanationService {
  constructor() {
    this.baseUrl = OLLAMA_CONFIG.url;
    this.model = OLLAMA_CONFIG.model;
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

    try {
      const fetch = (await import("node-fetch")).default;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: OLLAMA_CONFIG.options
        }),
        timeout: OLLAMA_CONFIG.timeout
      });

      const data = await response.json();

console.log("🦙 RAW OLLAMA RESPONSE:", JSON.stringify(data, null, 2));

if (data.error) {
  console.error("❌ OLLAMA ERROR:", data.error);
  return {
    success: false,
    explanation: "AI service is temporarily unavailable. Please try again later."
  };
}

return {
  success: true,
  explanation: data.response || "AI did not return an explanation."
};



    } catch (error) {
      return {
        success: false,
        explanation: "AI explanation failed. Please try again later."
      };
    }
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
