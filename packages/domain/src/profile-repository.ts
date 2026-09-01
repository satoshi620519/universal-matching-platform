import type { Profile } from './profile.js';

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
  delete(id: string): Promise<void>;
}
