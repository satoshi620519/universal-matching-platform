import * as SecureStore from 'expo-secure-store';
import type { CredentialStore } from './session';

const KEY = 'universal-matching.credential';
export const secureCredentialStore: CredentialStore = {
  get: () => SecureStore.getItemAsync(KEY),
  set: (value) => SecureStore.setItemAsync(KEY, value),
  clear: () => SecureStore.deleteItemAsync(KEY),
};
