export type AgeGroup =
  | 'age_1_3'
  | 'age_4_6'
  | 'age_7_9'
  | 'age_10_12'
  | 'age_13_15';

export type Theme = 'general' | 'biblical';

export type Challenge = {
  id: string;
  age_group: AgeGroup;
  theme: Theme;
  title: string;
  question: string;
  options: string[];
  explanation: string;
};

export type AnswerResponse = {
  challenge_id: string;
  is_correct: boolean;
  explanation: string;
};

export type ChallengeFilters = {
  ageGroup?: AgeGroup;
  theme?: Theme;
};
