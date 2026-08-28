import { describe, expect, it } from 'vitest';
import { addAnswer, EMPTY_PROGRESS } from '../progressLogic';
import { summarizeAdventure, summarizeProgress } from '../progressSummary';

describe('progressSummary', () => {
  it('resume uma aventura e arredonda o percentual', () => {
    let progress = addAnswer(EMPTY_PROGRESS, 'age_7_9', 'general', 'um', true);
    progress = addAnswer(progress, 'age_7_9', 'general', 'dois', false);
    progress = addAnswer(progress, 'age_7_9', 'general', 'três', true);

    expect(summarizeAdventure(progress, 'age_7_9', 'general')).toEqual({
      answered: 3,
      correct: 2,
      percentage: 67,
    });
  });

  it('soma todas as aventuras sem contar o placar legado', () => {
    let progress = { ...EMPTY_PROGRESS, legacyCorrectAnswers: 8 };
    progress = addAnswer(progress, 'age_4_6', 'general', 'um', true);
    progress = addAnswer(progress, 'age_10_12', 'biblical', 'dois', false);

    expect(summarizeProgress(progress)).toEqual({
      answered: 2,
      correct: 1,
      percentage: 50,
    });
  });

  it('retorna percentual zero quando ainda não há respostas', () => {
    expect(summarizeProgress(EMPTY_PROGRESS)).toEqual({
      answered: 0,
      correct: 0,
      percentage: 0,
    });
  });
});
