// backend/tests/ollama.test.js
import BaseOllamaService from '../src/services/ollama/base.service.js';

describe('Ollama Service', () => {
  let service;

  beforeAll(() => {
    service = new BaseOllamaService();
  });

  afterAll(() => {
    // Stop health checks to avoid hanging processes
    if (service) {
      service.stopHealthChecks();
    }
  });

  describe('Error Categorization', () => {
    test('should categorize timeout errors', () => {
      const error = new Error('timeout');
      error.name = 'AbortError';
      const result = service.categorizeError(error);
      expect(result.error).toBe('timeout');
      expect(result.message).toContain('timed out');
    });

    test('should categorize connection refused errors', () => {
      const error = new Error('connection refused');
      error.code = 'ECONNREFUSED';
      const result = service.categorizeError(error);
      expect(result.error).toBe('connection_refused');
      expect(result.message).toContain('Ollama is not running');
    });

    test('should categorize model not found errors', () => {
      const error = new Error('HTTP 404');
      const result = service.categorizeError(error);
      expect(result.error).toBe('model_not_found');
      expect(result.message).toContain('not found');
    });

    test('should categorize unknown errors', () => {
      const error = new Error('Something went wrong');
      const result = service.categorizeError(error);
      expect(result.error).toBe('unknown');
    });
  });

  describe('Error Messages', () => {
    test('should provide user-friendly timeout message', () => {
      const message = service.getErrorMessage('timeout');
      expect(message).toContain('timed out');
    });

    test('should provide user-friendly connection refused message', () => {
      const message = service.getErrorMessage('connection_refused');
      expect(message).toContain('ollama serve');
    });

    test('should provide user-friendly model not found message', () => {
      const message = service.getErrorMessage('model_not_found');
      expect(message).toContain('ollama pull');
    });
  });

  describe('Sleep Utility', () => {
    test('should sleep for specified duration', async () => {
      const start = Date.now();
      await service.sleep(100);
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Health Status', () => {
    test('should return health status object', () => {
      const status = service.getHealthStatus();
      expect(status).toHaveProperty('available');
      expect(status).toHaveProperty('lastCheck');
      expect(status).toHaveProperty('error');
      expect(status).toHaveProperty('model');
      expect(status).toHaveProperty('responseTime');
    });
  });
});
