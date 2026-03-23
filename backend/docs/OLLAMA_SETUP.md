# Ollama Setup Guide

## 📦 Installation

### Option 1: macOS / Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Option 2: Windows
Download installer from [https://ollama.com/download](https://ollama.com/download)

### Option 3: Docker
```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

## 🚀 Quick Start

### 1. Start Ollama Service
```bash
ollama serve
```

This will start the Ollama server on `http://localhost:11434`

### 2. Download Model
```bash
# Recommended model for code analysis (7B parameters)
ollama pull qwen2.5-coder:7b

# Alternative lightweight model (2B parameters)
ollama pull gemma:2b

# Alternative advanced model
ollama pull mistral
```

### 3. Verify Installation
```bash
# Test with backend script
cd backend
node scripts/test-ollama-health.js
```

Expected output:
```
🔍 Testing Ollama connection...

📊 Health Check Result:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ Available
Models: qwen2.5-coder:7b
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## ⚙️ Configuration

### Environment Variables

Create or update your `.env` file:

```env
# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b
OLLAMA_TIMEOUT_MS=30000
OLLAMA_MAX_RETRIES=3
OLLAMA_NUM_GPU=0
```

### Configuration Options

- **OLLAMA_URL**: URL where Ollama service is running (default: `http://localhost:11434`)
- **OLLAMA_MODEL**: Model to use for code analysis (default: `qwen2.5-coder:7b`)
- **OLLAMA_TIMEOUT_MS**: Request timeout in milliseconds (default: `30000`)
- **OLLAMA_MAX_RETRIES**: Number of retry attempts on failure (default: `3`)
- **OLLAMA_NUM_GPU**: Number of GPUs to use, 0 for CPU only (default: `0`)

## 🧪 Testing

### Test Health Check
```bash
cd backend
node scripts/test-ollama-health.js
```

### Test Code Comparison
```bash
cd backend
node scripts/test-comparison.js
```

### Run Jest Tests
```bash
cd backend
npm install
npm test
```

### API Health Check
```bash
# Start backend server
npm start

# In another terminal
curl http://localhost:5000/api/health/ollama
```

Expected response:
```json
{
  "status": "healthy",
  "model": "qwen2.5-coder:7b",
  "available": true,
  "responseTime": 45,
  "lastCheck": "2026-01-24T12:00:00.000Z",
  "error": null
}
```

## 🐛 Troubleshooting

### Issue: "Ollama is not running"
**Solution:**
```bash
# Start Ollama service
ollama serve
```

### Issue: "Model not found"
**Solution:**
```bash
# Download the model
ollama pull qwen2.5-coder:7b

# List available models
ollama list
```

### Issue: "Request timed out"
**Solution:**
1. Increase timeout in `.env`:
   ```env
   OLLAMA_TIMEOUT_MS=60000
   ```
2. Use a smaller model (gemma:2b instead of qwen2.5-coder:7b)
3. Enable GPU acceleration if available

### Issue: "Connection refused"
**Solution:**
- Check if Ollama is running: `curl http://localhost:11434/api/tags`
- Verify port is not blocked by firewall
- Check OLLAMA_URL in `.env` matches your Ollama instance

### Issue: Slow performance
**Solutions:**
1. **Use GPU acceleration** (if available):
   ```env
   OLLAMA_NUM_GPU=1
   ```

2. **Use smaller model**:
   ```env
   OLLAMA_MODEL=gemma:2b
   ```

3. **Reduce context size** in `backend/src/config/ollama.js`:
   ```javascript
   num_ctx: 1024  // default is 2048
   ```

## 📊 Model Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| gemma:2b | 2B | ⚡⚡⚡ Fast | ⭐⭐ Good | Testing, low-resource |
| qwen2.5-coder:7b | 7B | ⚡⚡ Medium | ⭐⭐⭐ Excellent | Production, code analysis |
| mistral | 7B | ⚡⚡ Medium | ⭐⭐⭐ Excellent | General purpose |

## 🔄 Health Monitoring

The system automatically checks Ollama health every 30 seconds:
- ✅ Verifies Ollama service is running
- ✅ Confirms the configured model is available
- ✅ Tracks response times
- ✅ Updates availability status

Check current status via API:
```bash
curl http://localhost:5000/api/health/ollama
```

## 🔒 Security Notes

1. **Local Only**: Ollama runs locally by default. No data leaves your machine.
2. **No API Keys**: No cloud API keys or authentication required.
3. **Sandboxed**: Code analysis happens in isolated environment.

## 📚 Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Available Models](https://ollama.com/library)
- [Model Configuration](https://github.com/ollama/ollama/blob/main/docs/modelfile.md)

## 💡 Tips

1. **First request is slower**: Model needs to load into memory
2. **Keep Ollama running**: For best performance, keep `ollama serve` running in background
3. **Monitor resources**: Large models (7B+) need ~8GB RAM minimum
4. **Update regularly**: Keep Ollama updated for best performance
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

## 🆘 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. View logs: Backend server logs show Ollama health checks
3. Test manually: `curl http://localhost:11434/api/tags`
4. GitHub Issues: Report bugs on the repository

---

**Last Updated**: January 2026
