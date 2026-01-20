/**
 * Calculates score for a submission (0–100)
 */
export const calculateScore = ({
  passed,
  userTime,
  bestTime,
  userMemory,
  bestMemory
}) => {
  if (!passed) return 0;

  // 1️⃣ Correctness (fixed)
  const correctness = 60;

  // 2️⃣ Time score (25)
  let timeScore = 25 * (bestTime / userTime);
  timeScore = Math.max(5, Math.min(25, timeScore));

  // 3️⃣ Memory score (10)
  let memoryScore = 10 * (bestMemory / userMemory);
  memoryScore = Math.max(3, Math.min(10, memoryScore));

  // 4️⃣ Code quality (AI – placeholder)
  const codeQuality = 5; // future AI hook

  return Math.round(
    correctness + timeScore + memoryScore + codeQuality
  );
};
