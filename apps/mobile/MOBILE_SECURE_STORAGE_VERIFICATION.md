# Secure Credential Adapter Verification

The native adapter is intentionally isolated from the application layer.

Before enabling a production mobile build:

1. Install an SDK-compatible `expo-secure-store` version using Expo's installer.
2. Verify the adapter compiles in the mobile workspace.
3. Verify credential persistence across app restart.
4. Verify sign-out deletes the credential.
5. Verify an invalid credential is cleared after a 401/403 session restore.
6. Verify no credential value appears in application logs.

The adapter stores only the authentication credential under a stable internal key. It must not become a general-purpose persistence API.
