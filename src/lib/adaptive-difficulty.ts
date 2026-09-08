export interface RoundResult { correct: boolean; responseTimeMs: number; }
export interface DifficultyState { level: number; rollingAccuracy: number; rollingAvgResponseMs: number; }

const WINDOW_SIZE = 5;

export function updateDifficulty(
  history: RoundResult[],
  currentLevel: number,
  bounds = { min: 1, max: 5 }
): DifficultyState {
  const recent = history.slice(-WINDOW_SIZE);
  const accuracy = recent.length ? recent.filter(r => r.correct).length / recent.length : 0.5;
  const avgResponseMs = recent.length
    ? recent.reduce((s, r) => s + r.responseTimeMs, 0) / recent.length : 0;

  let nextLevel = currentLevel;
  if (accuracy >= 0.8 && avgResponseMs < 4000) nextLevel++;
  else if (accuracy <= 0.4) nextLevel--;
  nextLevel = Math.max(bounds.min, Math.min(bounds.max, nextLevel));

  return { level: nextLevel, rollingAccuracy: accuracy, rollingAvgResponseMs: avgResponseMs };
}