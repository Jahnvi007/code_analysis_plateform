// backend/src/routes/health.routes.js
import express from 'express';
import BaseOllamaService from '../services/ollama/base.service.js';

const router = express.Router();

// Create an instance to get health status
const healthChecker = new BaseOllamaService();

router.get('/ollama', async (req, res) => {
  try {
    // Force a fresh health check
    const health = await healthChecker.checkHealth();
    
    res.status(health.available ? 200 : 503).json({
      status: health.available ? 'healthy' : 'unhealthy',
      model: health.model,
      available: health.available,
      responseTime: health.responseTime,
      lastCheck: health.lastCheck,
      error: health.error || null
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      available: false,
      error: 'health_check_failed',
      message: error.message
    });
  }
});

export default router;
