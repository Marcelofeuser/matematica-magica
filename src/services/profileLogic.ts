import type { Profile, ProfilesState } from '../types/profile';
import type { Progress } from '../types/progress';
import { EMPTY_PROGRESS, parseProgress } from './progressLogic';

export const EMPTY_PROFILES_STATE: ProfilesState = {
  version: 1,
  activeProfileId: null,
  profiles: [],
  progressByProfile: {},
};

export function normalizeProfileName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, 24);
}

export function addProfile(
  state: ProfilesState,
  profile: Profile,
  initialProgress: Progress = EMPTY_PROGRESS,
): ProfilesState {
  const name = normalizeProfileName(profile.name);
  if (!name) throw new Error('Informe um nome para o perfil.');
  if (state.profiles.some((item) => item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
    throw new Error('Já existe um perfil com esse nome.');
  }

  const normalized = { ...profile, name };
  return {
    ...state,
    activeProfileId: normalized.id,
    profiles: [...state.profiles, normalized],
    progressByProfile: {
      ...state.progressByProfile,
      [normalized.id]: initialProgress,
    },
  };
}

export function selectProfile(state: ProfilesState, profileId: string): ProfilesState {
  if (!state.profiles.some((profile) => profile.id === profileId)) return state;
  return { ...state, activeProfileId: profileId };
}

export function removeProfile(state: ProfilesState, profileId: string): ProfilesState {
  const profiles = state.profiles.filter((profile) => profile.id !== profileId);
  const { [profileId]: removed, ...progressByProfile } = state.progressByProfile;
  void removed;
  return {
    ...state,
    profiles,
    progressByProfile,
    activeProfileId: state.activeProfileId === profileId
      ? (profiles[0]?.id ?? null)
      : state.activeProfileId,
  };
}

export function setProfileProgress(
  state: ProfilesState,
  profileId: string,
  progress: Progress,
): ProfilesState {
  return {
    ...state,
    progressByProfile: { ...state.progressByProfile, [profileId]: progress },
  };
}

export function getProfileProgress(state: ProfilesState, profileId: string | null): Progress {
  return (profileId && state.progressByProfile[profileId]) || EMPTY_PROGRESS;
}

export function parseProfiles(stored: string | null): ProfilesState {
  if (!stored) return EMPTY_PROFILES_STATE;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.profiles)) {
      return EMPTY_PROFILES_STATE;
    }

    const profiles = parsed.profiles.filter(isProfile);
    const uniqueIds = new Set<string>();
    const uniqueNames = new Set<string>();
    const validProfiles = profiles.filter((profile) => {
      const normalizedName = normalizeProfileName(profile.name);
      const nameKey = normalizedName.toLocaleLowerCase();
      if (!profile.id || !normalizedName || uniqueIds.has(profile.id) || uniqueNames.has(nameKey)) {
        return false;
      }
      uniqueIds.add(profile.id);
      uniqueNames.add(nameKey);
      profile.name = normalizedName;
      return true;
    });

    const rawProgress = isRecord(parsed.progressByProfile) ? parsed.progressByProfile : {};
    const progressByProfile = Object.fromEntries(validProfiles.map((profile) => {
      const raw = rawProgress[profile.id];
      const serialized = raw === undefined ? null : JSON.stringify(raw);
      return [profile.id, parseProgress(serialized).progress];
    }));
    const requestedActiveId = typeof parsed.activeProfileId === 'string'
      ? parsed.activeProfileId
      : null;

    return {
      version: 1,
      profiles: validProfiles,
      progressByProfile,
      activeProfileId: requestedActiveId && uniqueIds.has(requestedActiveId)
        ? requestedActiveId
        : (validProfiles[0]?.id ?? null),
    };
  } catch {
    return EMPTY_PROFILES_STATE;
  }
}

function isProfile(value: unknown): value is Profile {
  return isRecord(value) && typeof value.id === 'string' &&
    typeof value.name === 'string' && typeof value.createdAt === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
