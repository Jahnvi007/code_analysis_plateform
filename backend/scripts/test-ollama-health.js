// backend/scripts/test-ollama-health.js
import { checkOllamaHealth } from '../src/config/ollama.js';

(async () => {
  console.log('🔍 Testing Ollama connection...\n');
  
  const health = await checkOllamaHealth();
  
  console.log('📊 Health Check Result:');
  console.log('━'.repeat(50));
  console.log('Status:', health.available ? '✅ Available' : '❌ Unavailable');
  
  if (health.available) {
    console.log('Models:', health.models.join(', '));
  } else {
    console.log('Error:', health.error);
  }
  
  console.log('━'.repeat(50));
  
  process.exit(health.available ? 0 : 1);
})();
