import { describe, expect, it } from 'vitest';
import {
  addProfile,
  EMPTY_PROFILES_STATE,
  getProfileProgress,
  normalizeProfileName,
  removeProfile,
  parseProfiles,
  selectProfile,
  setProfileProgress,
} from '../profileLogic';
import { addAnswer, EMPTY_PROGRESS } from '../progressLogic';

const ana = { id: 'ana', name: 'Ana', createdAt: '2026-01-01' };
const leo = { id: 'leo', name: 'Leo', createdAt: '2026-01-02' };

describe('profileLogic', () => {
  it('normaliza e limita nomes', () => {
    expect(normalizeProfileName('  Ana   Maria  ')).toBe('Ana Maria');
    expect(normalizeProfileName('a'.repeat(30))).toHaveLength(24);
  });

  it('cria e seleciona perfis', () => {
    const withAna = addProfile(EMPTY_PROFILES_STATE, ana);
    const withLeo = addProfile(withAna, leo);
    expect(withLeo.activeProfileId).toBe('leo');
    expect(selectProfile(withLeo, 'ana').activeProfileId).toBe('ana');
  });

  it('impede nomes duplicados sem diferenciar maiúsculas', () => {
    const state = addProfile(EMPTY_PROFILES_STATE, ana);
    expect(() => addProfile(state, { ...leo, name: ' ana ' })).toThrow();
  });

  it('mantém progresso separado e remove os dados com o perfil', () => {
    let state = addProfile(addProfile(EMPTY_PROFILES_STATE, ana), leo);
    const progress = addAnswer(EMPTY_PROGRESS, 'age_4_6', 'general', 'soma-1', true);
    state = setProfileProgress(state, 'ana', progress);
    expect(getProfileProgress(state, 'ana')).toEqual(progress);
    expect(getProfileProgress(state, 'leo')).toEqual(EMPTY_PROGRESS);
    const removed = removeProfile(state, 'ana');
    expect(removed.progressByProfile.ana).toBeUndefined();
  });

  it('recupera perfis válidos quando parte dos dados está corrompida', () => {
    const stored = JSON.stringify({
      version: 1,
      activeProfileId: 'inexistente',
      profiles: [ana, { ...leo, name: '  Leo  ' }, { id: '', name: 'Inválido', createdAt: 'x' }],
      progressByProfile: {
        ana: addAnswer(EMPTY_PROGRESS, 'age_4_6', 'general', 'soma-1', true),
        leo: { version: 1, legacyCorrectAnswers: -2, adventures: {} },
        órfão: EMPTY_PROGRESS,
      },
    });
    const parsed = parseProfiles(stored);
    expect(parsed.profiles).toEqual([ana, leo]);
    expect(parsed.activeProfileId).toBe('ana');
    expect(getProfileProgress(parsed, 'ana').adventures['age_4_6:general']).toBeDefined();
    expect(getProfileProgress(parsed, 'leo')).toEqual(EMPTY_PROGRESS);
    expect(parsed.progressByProfile.órfão).toBeUndefined();
  });

  it('remove ids e nomes de perfil duplicados ao carregar', () => {
    const parsed = parseProfiles(JSON.stringify({
      version: 1,
      activeProfileId: 'ana',
      profiles: [ana, { ...ana, name: 'Outra' }, { ...leo, name: ' ANA ' }, leo],
      progressByProfile: {},
    }));
    expect(parsed.profiles.map(({ id }) => id)).toEqual(['ana', 'leo']);
  });

});
