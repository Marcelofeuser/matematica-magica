import type { Challenge } from '../types/challenge';

export function shuffleChallenges(
  challenges: Challenge[],
  random: () => number = Math.random,
): Challenge[] {
  const shuffled = [...challenges];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export function prioritizeUnanswered(
  challenges: Challenge[],
  answeredChallengeIds: string[],
): Challenge[] {
  const answered = new Set(answeredChallengeIds);
  return [
    ...challenges.filter((challenge) => !answered.has(challenge.id)),
    ...challenges.filter((challenge) => answered.has(challenge.id)),
  ];
}

export function prepareChallengeOrder(
  challenges: Challenge[],
  answeredChallengeIds: string[],
  random: () => number = Math.random,
): Challenge[] {
  return prioritizeUnanswered(shuffleChallenges(challenges, random), answeredChallengeIds);
}
