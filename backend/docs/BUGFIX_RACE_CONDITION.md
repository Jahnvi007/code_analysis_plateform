# Bug Fix: Race Condition in Health Check Initialization

## Issue Description

User reported that `test-ollama-health.js` succeeded (showing 6 available models including `qwen2.5-coder:7b`) but `test-comparison.js` failed with "AI service is temporarily unavailable".

## Root Cause

Race condition in service initialization:

1. When `ComparisonService` singleton is created (via `export default new ComparisonService()`), the constructor runs
2. Parent constructor (`BaseOllamaService`) calls `startHealthChecks()`
3. `startHealthChecks()` calls `checkHealth()` which is async
4. The async health check starts but doesn't block - control returns immediately
5. `compareCode()` gets called before the health check completes
6. `generateCompletion()` checks `if (!this.healthStatus.available)` and bails out
7. User sees "AI service is temporarily unavailable" error

## Why test-ollama-health.js Worked

The health check script uses a standalone `checkOllamaHealth()` function from `config/ollama.js` which:
- Doesn't use the singleton service
- Properly awaits the fetch request
- No race condition

## Solution

Modified `BaseOllamaService` to:

1. **Store the initial health check promise:**
```javascript
startHealthChecks() {
  this.initialHealthCheckPromise = this.checkHealth();
  // ...
}
```

2. **Wait for it before processing requests:**
```javascript
async generateCompletion(prompt, options = {}) {
  if (this.initialHealthCheckPromise) {
    await this.initialHealthCheckPromise;
    this.initialHealthCheckPromise = null;
  }
  // ... proceed with request
}
```

3. **Removed early bail-out check:**
   - Previously returned error immediately if `!this.healthStatus.available`
   - Now attempts the request anyway (retry logic will handle failures)
   - Better UX: provides specific error from actual request attempt

## Benefits

- ✅ Eliminates race condition
- ✅ First request always waits for health check
- ✅ Subsequent requests proceed immediately (promise is null)
- ✅ Graceful degradation if health check fails
- ✅ Better error messages from actual request attempts

## Testing

Both scripts now work correctly:
- `test-ollama-health.js` - Still works as before
- `test-comparison.js` - Now waits for health check before attempting comparison

## Commit

fae05e0 - "Fix race condition in health check initialization for generateCompletion"
