// src/config/ollama.js
export const OLLAMA_CONFIG = {
  url: process.env.OLLAMA_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b',
  timeout: parseInt(process.env.OLLAMA_TIMEOUT_MS) || 30000,
  maxRetries: parseInt(process.env.OLLAMA_MAX_RETRIES) || 3,
  healthCheckInterval: 30000, // 30 seconds
  options: {
    num_gpu: parseInt(process.env.OLLAMA_NUM_GPU) || 0,
    num_ctx: 2048,
    temperature: 0.2,
    top_p: 0.9,
    num_predict: 600
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