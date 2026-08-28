import { describe, expect, it } from 'vitest';
import {
  addAnswer,
  EMPTY_PROGRESS,
  getAdventureProgress,
  parseProgress,
} from '../progressLogic';

describe('progressLogic', () => {
  it('separa o progresso por aventura', () => {
    const progress = addAnswer(EMPTY_PROGRESS, 'age_4_6', 'general', 'soma-1', true);
    expect(getAdventureProgress(progress, 'age_4_6', 'general')).toEqual({
      answeredChallengeIds: ['soma-1'],
      correctChallengeIds: ['soma-1'],
    });
    expect(getAdventureProgress(progress, 'age_4_6', 'biblical').answeredChallengeIds).toEqual([]);
  });

  it('não duplica um desafio repetido', () => {
    const first = addAnswer(EMPTY_PROGRESS, 'age_7_9', 'general', 'divisao-1', true);
    const repeated = addAnswer(first, 'age_7_9', 'general', 'divisao-1', true);
    expect(getAdventureProgress(repeated, 'age_7_9', 'general')).toEqual({
      answeredChallengeIds: ['divisao-1'],
      correctChallengeIds: ['divisao-1'],
    });
  });

  it('mantém um desafio respondido como incorreto fora dos acertos', () => {
    const progress = addAnswer(EMPTY_PROGRESS, 'age_10_12', 'biblical', 'fracao-1', false);
    expect(getAdventureProgress(progress, 'age_10_12', 'biblical')).toEqual({
      answeredChallengeIds: ['fracao-1'],
      correctChallengeIds: [],
    });
  });

  it('migra o contador numérico legado', () => {
    const result = parseProgress('8');
    expect(result.progress.legacyCorrectAnswers).toBe(8);
    expect(result.shouldPersist).toBe(true);
  });

  it('rejeita progresso corrompido ou inconsistente', () => {
    const invalid = JSON.stringify({
      version: 1,
      legacyCorrectAnswers: 0,
      adventures: {
        'age_4_6:general': {
          answeredChallengeIds: [],
          correctChallengeIds: ['não-respondido'],
        },
      },
    });
    expect(parseProgress(invalid).shouldRemove).toBe(true);
    expect(parseProgress('{inválido').shouldRemove).toBe(true);
  });
});
