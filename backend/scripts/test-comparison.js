// backend/scripts/test-comparison.js
import ComparisonService from '../src/services/ollama/comparison.service.js';

(async () => {
  console.log('🔍 Testing Code Comparison...\n');

  const yourCode = `def slow_sum(n):
    total = 0
    for i in range(n):
        total += i
    return total`;

  const theirCode = `def fast_sum(n):
    return n * (n - 1) // 2`;

  console.log('Your Code (O(n)):');
  console.log(yourCode);
  console.log('\nTheir Code (O(1)):');
  console.log(theirCode);
  console.log('\n' + '━'.repeat(50));
  
  const result = await ComparisonService.compareCode(
    yourCode,
    theirCode,
    'Sum Numbers',
    { score: 60, executionTimeMs: 150, memoryUsedKB: 2000, complexity: 'O(n)' },
    { score: 95, executionTimeMs: 10, memoryUsedKB: 100, complexity: 'O(1)' }
  );

  console.log('\n📊 Comparison Result:');
  console.log('━'.repeat(50));
  
  if (result.success) {
    console.log('✅ Success!');
    console.log(`Model: ${result.model}`);
    console.log(`Processing Time: ${result.processingTime}`);
    console.log('\nExplanation:');
    console.log(result.explanation);
  } else {
    console.log('❌ Failed!');
    console.log('Error:', result.explanation);
  }
  
  console.log('━'.repeat(50));
  
  // Stop health checks
  ComparisonService.stopHealthChecks();
  
  process.exit(result.success ? 0 : 1);
})();
