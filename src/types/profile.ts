import type { Progress } from './progress';

export type Profile = {
  id: string;
  name: string;
  createdAt: string;
};

export type ProfilesState = {
  version: 1;
  activeProfileId: string | null;
  profiles: Profile[];
  progressByProfile: Record<string, Progress>;
};
