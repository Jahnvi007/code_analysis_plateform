import fetch from 'node-fetch';

// Ping Ollama every 30 seconds to keep model loaded
setInterval(async () => {
  try {
    await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5-coder:7b',
        prompt: 'ping',
        stream: false,
        options: { num_predict: 1 }
      })
    });
    console.log('✅ Kept Ollama warm');
  } catch (err) {
    console.error('❌ Warmup failed:', err.message);
  }
}, 30000);

console.log('🔥 Ollama warmup script running...');