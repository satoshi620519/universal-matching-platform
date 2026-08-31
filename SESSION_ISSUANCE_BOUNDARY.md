# Session issuance boundary

Password credential verification and session issuance are separate application
responsibilities.

```
PasswordSignInService
  -> authenticated accountId
  -> SessionIssuanceService
  -> SessionRepository
  -> session persistence/token representation
```

The current boundary intentionally defines only the application contract and a
bounded seven-day expiry. No database schema, bearer-token format, cookie
format, or request authentication adapter is introduced until the session
representation and revocation semantics are defined.

This prevents issuing a credential-derived token format that cannot later be
revoked or safely resolved by RequestAuthenticationAdapter.
