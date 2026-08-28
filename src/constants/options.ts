import type { AgeGroup, Theme } from '../types/challenge';

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  age_1_3: '1 a 3 anos',
  age_4_6: '4 a 6 anos',
  age_7_9: '7 a 9 anos',
  age_10_12: '10 a 12 anos',
  age_13_15: '13 a 15 anos',
};

export const THEME_LABELS: Record<Theme, string> = {
  general: 'Aventura Geral',
  biblical: 'Aventura Bíblica Cristã',
};
