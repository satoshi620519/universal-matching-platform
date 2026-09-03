# Mobile Sign-in UI Slice

The first UI slice connects the existing application-layer signIn() function to a native screen.

## Rules
- The screen never reads or writes the credential directly.
- Password input uses secureTextEntry.
- API failures produce a generic user-facing message.
- Credential values and raw backend errors are not rendered.
- Successful authentication returns an Account through an explicit callback.

## Next connection
AppShell should render this screen for the unauthenticated state and transition to authenticated state through onAuthenticated.
