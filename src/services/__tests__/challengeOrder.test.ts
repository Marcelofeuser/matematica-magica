import { describe, expect, it } from 'vitest';
import { prepareChallengeOrder, prioritizeUnanswered, shuffleChallenges } from '../challengeOrder';
import type { Challenge } from '../../types/challenge';

function challenge(id: string): Challenge {
  return {
    id,
    age_group: 'age_7_9',
    theme: 'general',
    title: id,
    question: id,
    options: ['1', '2'],
    explanation: id,
  };
}

const challenges = [challenge('a'), challenge('b'), challenge('c'), challenge('d')];

describe('challengeOrder', () => {
  it('embaralha sem modificar a lista original', () => {
    const shuffled = shuffleChallenges(challenges, () => 0);
    expect(shuffled.map(({ id }) => id)).toEqual(['b', 'c', 'd', 'a']);
    expect(challenges.map(({ id }) => id)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('coloca desafios inéditos antes dos já respondidos', () => {
    const ordered = prioritizeUnanswered(challenges, ['a', 'c']);
    expect(ordered.map(({ id }) => id)).toEqual(['b', 'd', 'a', 'c']);
  });

  it('preserva todos os desafios ao preparar uma aventura', () => {
    const ordered = prepareChallengeOrder(challenges, ['b'], () => 0.5);
    expect(ordered).toHaveLength(challenges.length);
    expect(new Set(ordered.map(({ id }) => id))).toEqual(new Set(['a', 'b', 'c', 'd']));
    expect(ordered.at(-1)?.id).toBe('b');
  });
});
