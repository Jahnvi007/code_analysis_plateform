// src/config/ollama.js
export const OLLAMA_CONFIG = {
  url: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'qwen2.5-coder:1.5b',
  timeout: 60000, // ← Change from 30000 to 60000 (60 seconds)
  maxRetries: parseInt(process.env.OLLAMA_MAX_RETRIES) || 3,
  healthCheckInterval: 30000,
 options: {
  num_gpu: 0,
  num_ctx: 1024,  // ← Change from 2048 to 1024
  temperature: 0.2,
  top_p: 0.9,
  num_predict: 400  // ← Change from 600 to 400 (shorter responses)
}
};

export const checkOllamaHealth = async () => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${OLLAMA_CONFIG.url}/api/tags`, {
      timeout: 2000
    });
    const data = await response.json();
    return {
      available: true,
      models: data.models.map(m => m.name)
    };
  } catch (error) {
    return {
      available: false,
      error: error.message
    };
  }
};