import { API_URL } from '../constants/config';
import type {
  AnswerResponse,
  Challenge,
  ChallengeFilters,
} from '../types/challenge';

export async function getChallenges(
  filters: ChallengeFilters = {},
): Promise<Challenge[]> {
  const query = new URLSearchParams();
  if (filters.ageGroup) query.set('age_group', filters.ageGroup);
  if (filters.theme) query.set('theme', filters.theme);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const response = await fetch(`${API_URL}/challenges${suffix}`);

  if (!response.ok) {
    throw new Error('Não foi possível carregar os desafios.');
  }

  return response.json() as Promise<Challenge[]>;
}

export async function answerChallenge(
  challengeId: string,
  answer: string,
): Promise<AnswerResponse> {
  const response = await fetch(`${API_URL}/challenges/${challengeId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer }),
  });

  if (!response.ok) {
    throw new Error('Não foi possível validar a resposta.');
  }

  return response.json() as Promise<AnswerResponse>;
}
