# Password registration application flow

## Flow

```
registration input
  │ plaintext password
  ▼
PasswordRegistrationService
  │
  ├─ PasswordHasher.hash()
  │      ↓ opaque password hash
  │
  └─ PasswordRegistrationRepository.create()
          ↓ one transaction
       ├─ Account (pending)
       ├─ AuthenticationIdentity (email-password, active)
       └─ PasswordCredential (active)
```

## Boundary guarantees

- Plaintext is consumed by PasswordHasher before persistence is invoked.
- The registration repository receives an opaque hash only.
- Account status begins as pending; verification/activation remains a separate lifecycle.
- Hashing failures do not invoke persistence.
- Persistence failures propagate from the atomic boundary without fallback writes.

## Not yet exposed

This application service is intentionally not an HTTP registration endpoint. Transport validation, duplicate identity behavior, email normalization, password policy and rate limiting must be defined before public exposure.
