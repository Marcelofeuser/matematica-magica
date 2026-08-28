import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROGRESS_KEY } from '../constants/config';
import type { AgeGroup, Theme } from '../types/challenge';
import type { Progress } from '../types/progress';
import {
  addAnswer,
  adventureKey,
  EMPTY_PROGRESS,
  getAdventureProgress,
  parseProgress,
} from './progressLogic';

export { adventureKey, EMPTY_PROGRESS, getAdventureProgress };

export async function loadProgress(): Promise<Progress> {
  const stored = await AsyncStorage.getItem(PROGRESS_KEY);
  const result = parseProgress(stored);
  if (result.shouldPersist) await saveProgress(result.progress);
  if (result.shouldRemove) await AsyncStorage.removeItem(PROGRESS_KEY);
  return result.progress;
}

export async function recordAnswer(
  progress: Progress,
  ageGroup: AgeGroup,
  theme: Theme,
  challengeId: string,
  isCorrect: boolean,
): Promise<Progress> {
  const next = addAnswer(progress, ageGroup, theme, challengeId, isCorrect);
  await saveProgress(next);
  return next;
}

async function saveProgress(progress: Progress): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}
