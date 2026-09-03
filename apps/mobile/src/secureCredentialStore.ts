import * as SecureStore from 'expo-secure-store';
import type { CredentialStore } from './index.js';

const CREDENTIAL_KEY = 'connect.credential';

export function createSecureCredentialStore(): CredentialStore {
  return {
    get: () => SecureStore.getItemAsync(CREDENTIAL_KEY),
    set: (credential) => SecureStore.setItemAsync(CREDENTIAL_KEY, credential),
    clear: () => SecureStore.deleteItemAsync(CREDENTIAL_KEY),
  };
}
