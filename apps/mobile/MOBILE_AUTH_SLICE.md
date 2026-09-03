# Mobile Authentication Slice

## Scope
This slice completes the application-layer contract for sign-in without selecting a native UI framework.

## Flow
1. Submit email and password to `POST /auth/sign-in`.
2. Accept the returned credential.
3. Persist it only through `CredentialStore`.
4. Resolve `/accounts/authenticated` to establish the session.
5. If credential validation fails with 401/403, clear it and return to unauthenticated state.

## Boundary
UI code calls the application functions in `src/auth.ts`; it does not construct authorization headers or write credentials directly.

## Native adapter requirement
A future Expo/React Native adapter must implement CredentialStore with OS-backed secure storage before production authentication UI is enabled.
