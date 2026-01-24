// backend/src/services/ollama/base.service.js
import { OLLAMA_CONFIG } from "../../config/ollama.js";

class BaseOllamaService {
  constructor() {
    this.baseUrl = OLLAMA_CONFIG.url;
    this.model = OLLAMA_CONFIG.model;
    this.timeout = OLLAMA_CONFIG.timeout;
    this.maxRetries = OLLAMA_CONFIG.maxRetries;
    this.options = OLLAMA_CONFIG.options;
    this.healthStatus = {
      available: false,
      lastCheck: null,
      error: null,
      model: this.model,
      responseTime: null
    };

    // Start periodic health checks
    this.startHealthChecks();
  }

  /**
   * Start background health checks every 30 seconds
   */
  startHealthChecks() {
    // Initial check
    this.checkHealth();
    
    // Periodic checks
    this.healthCheckInterval = setInterval(() => {
      this.checkHealth();
    }, OLLAMA_CONFIG.healthCheckInterval);
  }

  /**
   * Stop health check interval (useful for testing)
   */
  stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }

  /**
   * Check Ollama service health and model availability
   */
  async checkHealth() {
    const startTime = Date.now();
    try {
      const fetch = (await import('node-fetch')).default;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), OLLAMA_CONFIG.healthCheckTimeout);

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const modelExists = data.models && data.models.some(m => m.name === this.model);
      
      this.healthStatus = {
        available: modelExists,
        lastCheck: new Date(),
        error: modelExists ? null : 'model_not_found',
        model: this.model,
        responseTime: Date.now() - startTime
      };

      if (!modelExists) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`⚠️  Ollama model '${this.model}' not found. Available models:`, 
            data.models.map(m => m.name).join(', '));
        } else {
          console.log(`⚠️  Ollama model '${this.model}' not found`);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`✅ Ollama health check passed (${this.healthStatus.responseTime}ms)`);
        }
      }

      return this.healthStatus;
    } catch (error) {
      this.healthStatus = {
        available: false,
        lastCheck: new Date(),
        error: this.categorizeError(error).error,
        model: this.model,
        responseTime: Date.now() - startTime
      };

      console.log('⚠️  Ollama health check failed:', this.healthStatus.error);
      return this.healthStatus;
    }
  }

  /**
   * Get current health status without performing a check
   */
  getHealthStatus() {
    return { ...this.healthStatus };
  }

  /**
   * Generate completion with retry logic and timeout handling
   */
  async generateCompletion(prompt, options = {}) {
    // Check if service is available
    if (!this.healthStatus.available) {
      return {
        success: false,
        error: this.healthStatus.error || 'service_unavailable',
        message: this.getErrorMessage(this.healthStatus.error || 'service_unavailable')
      };
    }

    const maxRetries = options.maxRetries || this.maxRetries;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const fetch = (await import('node-fetch')).default;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(`${this.baseUrl}/api/generate`, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            prompt,
            stream: false,
            options: { ...this.options, ...options }
          })
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.response) {
          throw new Error('Invalid response format');
        }
        
        return { 
          success: true, 
          response: data.response,
          model: this.model 
        };
        
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`⚠️  Attempt ${attempt}/${maxRetries} failed:`, error.message);
        }
        
        if (attempt < maxRetries) {
          const delay = 1000 * Math.pow(2, attempt - 1); // Exponential backoff: 1s, 2s, 4s
          if (process.env.NODE_ENV !== 'production') {
            console.log(`⏳ Retrying in ${delay}ms...`);
          }
          await this.sleep(delay);
          continue;
        }
        
        return this.handleError(error);
      }
    }
  }

  /**
   * Categorize error and return structured error info
   */
  categorizeError(error) {
    if (error.name === 'AbortError' || error.type === 'aborted') {
      return {
        error: 'timeout',
        message: `Request timed out after ${this.timeout}ms`
      };
    }
    
    if (error.code === 'ECONNREFUSED') {
      return {
        error: 'connection_refused',
        message: 'Ollama is not running. Start it with: ollama serve'
      };
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      return {
        error: 'connection_refused',
        message: `Cannot reach Ollama at ${this.baseUrl}`
      };
    }

    if (error.message.includes('HTTP 404')) {
      return {
        error: 'model_not_found',
        message: `Model '${this.model}' not found. Download it with: ollama pull ${this.model}`
      };
    }

    if (error.message.includes('Invalid response')) {
      return {
        error: 'invalid_response',
        message: 'Ollama returned an invalid response'
      };
    }
    
    return {
      error: 'unknown',
      message: error.message || 'Unknown error occurred'
    };
  }

  /**
   * Handle error and return failure response
   */
  handleError(error) {
    const categorized = this.categorizeError(error);
    return {
      success: false,
      ...categorized
    };
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(errorType) {
    const messages = {
      timeout: `Request timed out after ${this.timeout}ms. The model might be too slow.`,
      connection_refused: 'Ollama is not running. Start it with: ollama serve',
      model_not_found: `Model '${this.model}' not found. Download it with: ollama pull ${this.model}`,
      invalid_response: 'Ollama returned an invalid response',
      service_unavailable: 'AI service is temporarily unavailable',
      unknown: 'An unknown error occurred'
    };

    return messages[errorType] || messages.unknown;
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default BaseOllamaService;
