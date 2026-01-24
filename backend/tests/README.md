# Testing Guide

## 🧪 Running Tests

### Jest Unit Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Manual Test Scripts

#### Test Ollama Health Check
```bash
node scripts/test-ollama-health.js
```

This will check if Ollama is running and the configured model is available.

**Expected output (Ollama running):**
```
🔍 Testing Ollama connection...

📊 Health Check Result:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ Available
Models: qwen2.5-coder:7b
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Expected output (Ollama not running):**
```
🔍 Testing Ollama connection...

📊 Health Check Result:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ❌ Unavailable
Error: request to http://localhost:11434/api/tags failed, reason: ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Test Code Comparison
```bash
node scripts/test-comparison.js
```

This will test the AI code comparison functionality with sample code.

## 📦 Thunder Client Tests

Import the collection from `tests/thunder-client/ollama-tests.json` into Thunder Client to test API endpoints:

1. **Health Check** - `GET /api/health/ollama`
2. **Compare Submissions** - `POST /api/comparison/compare/:submissionId` (requires auth)
3. **Explain Submission** - `POST /api/submissions/:id/explain` (requires auth)

## 🎯 Test Coverage

Current test coverage includes:

### BaseOllamaService Tests
- ✅ Error categorization (timeout, connection refused, model not found)
- ✅ User-friendly error messages
- ✅ Sleep utility for retry delays
- ✅ Health status object structure

### Integration Tests
- Manual scripts for health check and comparison
- Thunder Client collection for API endpoints

## 🐛 Troubleshooting

### Jest doesn't exit
This is expected behavior due to health check intervals. The tests still pass correctly.

### "Cannot use import statement outside a module"
Make sure you're using Node.js 18+ and the test command includes `--experimental-vm-modules` flag.

### Tests fail with connection errors
This is normal if Ollama is not running. The tests check error handling, not actual Ollama functionality.

## 📊 Understanding Test Results

All tests should pass even if Ollama is not running, as they test the error handling and service structure, not the actual AI functionality.

To test with real Ollama:
1. Start Ollama: `ollama serve`
2. Download model: `ollama pull qwen2.5-coder:7b`
3. Run manual scripts: `node scripts/test-ollama-health.js`
