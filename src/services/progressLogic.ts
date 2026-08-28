import type { AgeGroup, Theme } from '../types/challenge';
import type { AdventureProgress, Progress } from '../types/progress';

export const EMPTY_PROGRESS: Progress = {
  version: 1,
  legacyCorrectAnswers: 0,
  adventures: {},
};

export function adventureKey(ageGroup: AgeGroup, theme: Theme): string {
  return `${ageGroup}:${theme}`;
}

export function getAdventureProgress(
  progress: Progress,
  ageGroup: AgeGroup,
  theme: Theme,
): AdventureProgress {
  return progress.adventures[adventureKey(ageGroup, theme)] ?? {
    answeredChallengeIds: [],
    correctChallengeIds: [],
  };
}

export function addAnswer(
  progress: Progress,
  ageGroup: AgeGroup,
  theme: Theme,
  challengeId: string,
  isCorrect: boolean,
): Progress {
  const key = adventureKey(ageGroup, theme);
  const current = getAdventureProgress(progress, ageGroup, theme);
  const answered = new Set(current.answeredChallengeIds);
  const correct = new Set(current.correctChallengeIds);
  answered.add(challengeId);
  if (isCorrect) correct.add(challengeId);

  return {
    ...progress,
    adventures: {
      ...progress.adventures,
      [key]: {
        answeredChallengeIds: [...answered],
        correctChallengeIds: [...correct],
      },
    },
  };
}

export function parseProgress(stored: string | null): {
  progress: Progress;
  shouldPersist: boolean;
  shouldRemove: boolean;
} {
  if (!stored) return { progress: EMPTY_PROGRESS, shouldPersist: false, shouldRemove: false };

  const legacyScore = Number(stored);
  if (Number.isInteger(legacyScore) && legacyScore >= 0) {
    return {
      progress: { ...EMPTY_PROGRESS, legacyCorrectAnswers: legacyScore },
      shouldPersist: true,
      shouldRemove: false,
    };
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (isProgress(parsed)) {
      return { progress: parsed, shouldPersist: false, shouldRemove: false };
    }
  } catch {
    // O valor inválido será removido abaixo.
  }

  return { progress: EMPTY_PROGRESS, shouldPersist: false, shouldRemove: true };
}

function isProgress(value: unknown): value is Progress {
  if (!isRecord(value) || value.version !== 1) return false;
  const legacyCorrectAnswers = value.legacyCorrectAnswers;
  if (typeof legacyCorrectAnswers !== 'number' ||
      !Number.isInteger(legacyCorrectAnswers) || legacyCorrectAnswers < 0) return false;
  if (!isRecord(value.adventures)) return false;

  return Object.values(value.adventures).every((adventure) => {
    if (!isRecord(adventure)) return false;
    const answered = adventure.answeredChallengeIds;
    const correct = adventure.correctChallengeIds;
    return isStringArray(answered) &&
      isStringArray(correct) &&
      correct.every((id) => answered.includes(id));
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
