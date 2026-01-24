// backend/src/services/ollama.service.js
import { OLLAMA_CONFIG } from "../config/ollama.js";

class OllamaService {
  constructor() {
    this.baseUrl = OLLAMA_CONFIG.url;
    this.model = OLLAMA_CONFIG.model;
    this.isAvailable = false;
    this.checkAvailability();
  }

  async checkAvailability() {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        timeout: 2000
      });
      const data = await response.json();
      this.isAvailable = data.models && data.models.length > 0;
      
      if (this.isAvailable) {
        console.log('✅ Ollama is available with models:', data.models.map(m => m.name).join(', '));
      } else {
        console.log('⚠️  Ollama running but no models found');
      }
    } catch (error) {
      console.log('⚠️  Ollama not available:', error.message);
      this.isAvailable = false;
    }
  }

  async compareCode(yourCode, theirCode, problemTitle, yourMetrics, theirMetrics) {
    if (!this.isAvailable) {
      return {
        success: false,
        explanation: "AI service not available. Please start Ollama with: ollama serve"
      };
    }

    const prompt = this.buildComparisonPrompt(
      yourCode,
      theirCode,
      problemTitle,
      yourMetrics,
      theirMetrics
    );

    try {
      const fetch = (await import('node-fetch')).default;
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: OLLAMA_CONFIG.options
        }),
        timeout: OLLAMA_CONFIG.timeout
      });

      console.log("📢 Sending prompt to Ollama:", prompt);
const data = await response.json();
console.log("📢 Ollama raw response:", data);

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

      return {
        success: true,
        explanation: data.response,
        processingTime: `${processingTime}s`,
        model: this.model
      };

    } catch (error) {
      console.error('Ollama API error:', error);
      return {
        success: false,
        explanation: `AI comparison failed: ${error.message}. Make sure Ollama is running.`
      };
    }
  }

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

export default new OllamaService();