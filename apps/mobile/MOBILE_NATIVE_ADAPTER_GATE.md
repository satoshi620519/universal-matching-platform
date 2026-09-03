# Mobile Native Adapter Gate

## Purpose
The application layer is now defined through API, credential, session, and authentication contracts. Native runtime dependencies must not be introduced until their adapter responsibilities are explicit.

## Required adapters
- SecureCredentialStore: OS-backed credential persistence
- EnvironmentProvider: development/staging/production API base URL
- NavigationAdapter: feature destinations to native routes
- NotificationAdapter: permission and token lifecycle
- DeepLinkAdapter: validated external route inputs

## Production security rule
A production mobile build MUST provide SecureCredentialStore using a platform-backed secure storage mechanism. In-memory stores are permitted only for tests and development previews.

## Dependency gate
When Expo/React Native is introduced, dependency versions and setup commands must be committed together with:
1. executable dev command
2. iOS build command
3. Android build command
4. environment configuration example
5. secure-storage adapter
6. CI typecheck/test coverage

## First native integration slice
Secure credential storage is the first adapter because authentication and session restoration already depend on it.
