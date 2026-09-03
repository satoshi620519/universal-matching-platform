# Secure Credential Storage Adapter

The application layer exposes CredentialStore and intentionally does not depend on Expo.

A native Expo adapter can satisfy that contract with expo-secure-store:

- get() -> SecureStore.getItemAsync
- set() -> SecureStore.setItemAsync
- clear() -> SecureStore.deleteItemAsync

## Security constraints
- Credentials are small secrets only.
- Do not substitute AsyncStorage for credentials.
- Native integration must use OS-backed secure storage.
- The adapter is isolated so test environments can provide an in-memory implementation.
- Production integration must document iOS/Android backup and uninstall behavior.

## Integration command
When the Expo runtime is introduced, install the SDK-compatible package using:

pnpm expo install expo-secure-store

The Expo documentation describes SecureStore as encrypted local key-value storage backed by platform facilities on Android and iOS.
