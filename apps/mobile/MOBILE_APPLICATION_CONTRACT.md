# Mobile Application Contract

## API environment
The API base URL is injected through a platform environment adapter. Production builds must not hard-code localhost.

```ts
export interface ApiEnvironment {
  baseUrl: string;
}
```

## Credential boundary
Mobile code depends on an asynchronous credential store abstraction. Platform implementations must use secure OS-backed storage.

```ts
export interface CredentialStore {
  get(): Promise<string | null>;
  set(credential: string): Promise<void>;
  clear(): Promise<void>;
}
```

No feature may directly persist credentials.

## Navigation boundary
Navigation is expressed as feature destinations, not framework-specific route objects:

- auth
- onboarding
- discovery
- matches
- conversations
- conversation detail
- notifications
- profile
- settings
- safety report

Framework adapters translate these destinations into native navigation.

## Session contract
Session restoration sequence:
1. Read credential from CredentialStore.
2. If absent, enter unauthenticated state.
3. Call authenticated account endpoint.
4. On 401/403, clear credential and enter unauthenticated state.
5. On success, expose authenticated account state.

## Initial vertical slice
The first executable slice is authentication/session restoration and must include API client behavior, credential boundary, session state machine, and unit tests before UI screens are added.
