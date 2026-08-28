import type { AgeGroup, Theme } from '../types/challenge';
import type { Progress } from '../types/progress';
import { getAdventureProgress } from './progressLogic';

export type ProgressSummary = {
  answered: number;
  correct: number;
  percentage: number;
};

export function summarizeAdventure(
  progress: Progress,
  ageGroup: AgeGroup,
  theme: Theme,
): ProgressSummary {
  const adventure = getAdventureProgress(progress, ageGroup, theme);
  return summarizeCounts(
    adventure.answeredChallengeIds.length,
    adventure.correctChallengeIds.length,
  );
}

export function summarizeProgress(progress: Progress): ProgressSummary {
  const totals = Object.values(progress.adventures).reduce(
    (sum, adventure) => ({
      answered: sum.answered + adventure.answeredChallengeIds.length,
      correct: sum.correct + adventure.correctChallengeIds.length,
    }),
    { answered: 0, correct: 0 },
  );
  return summarizeCounts(totals.answered, totals.correct);
}

function summarizeCounts(answered: number, correct: number): ProgressSummary {
  return {
    answered,
    correct,
    percentage: answered ? Math.round((correct / answered) * 100) : 0,
  };
}
