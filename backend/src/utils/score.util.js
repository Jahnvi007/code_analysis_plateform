// src/utils/score.util.js

export function calculateProblemScore({
  verdict,
  userTime,
  bestTime,
  userMemory,
  bestMemory,
  difficulty
}) {
  // Gatekeeper
  if (verdict !== "Accepted") return 0;

  // Safety guards
  if (!userTime || userTime <= 0) userTime = bestTime || 1;
  if (!userMemory || userMemory <= 0) userMemory = bestMemory || 1;
  if (!bestTime || bestTime <= 0) bestTime = userTime;
  if (!bestMemory || bestMemory <= 0) bestMemory = userMemory;

  // Normalize
  const timeRatio = bestTime / userTime;
  const memoryRatio = bestMemory / userMemory;

  const timeScore = Math.min(50, 50 * timeRatio);
  const memoryScore = Math.min(30, 30 * memoryRatio);

  const difficultyWeight = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0
  }[difficulty] || 1.0;

  const rawScore = timeScore + memoryScore;
  const finalScore = rawScore * difficultyWeight;

  return Math.round(finalScore);
}
