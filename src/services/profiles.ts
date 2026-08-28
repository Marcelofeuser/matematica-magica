import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROFILES_KEY } from '../constants/config';
import type { ProfilesState } from '../types/profile';
import { parseProfiles } from './profileLogic';

export async function loadProfiles(): Promise<ProfilesState> {
  return parseProfiles(await AsyncStorage.getItem(PROFILES_KEY));
}

export async function saveProfiles(state: ProfilesState): Promise<void> {
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(state));
}
