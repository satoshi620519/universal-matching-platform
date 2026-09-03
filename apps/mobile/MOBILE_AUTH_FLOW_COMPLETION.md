# Mobile Authentication Flow Completion

The unauthenticated application state now renders SignInScreen.

Successful flow:
1. User enters credentials.
2. SignInScreen calls application-layer signIn().
3. signIn() requests the backend credential.
4. CredentialStore persists the credential through the native secure adapter.
5. Authenticated account is resolved.
6. App shell transitions to authenticated state.

Failure boundaries:
- UI does not display raw backend errors.
- Credentials are never rendered.
- Invalid session restoration clears invalid credentials.
- Missing API configuration fails explicitly rather than silently calling an unintended host.

Next slice: registration and email verification, followed by protected navigation.
