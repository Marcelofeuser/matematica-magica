export type AdventureProgress = {
  answeredChallengeIds: string[];
  correctChallengeIds: string[];
};

export type Progress = {
  version: 1;
  legacyCorrectAnswers: number;
  adventures: Record<string, AdventureProgress>;
};
