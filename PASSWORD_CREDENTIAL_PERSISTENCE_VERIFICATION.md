# Password credential persistence verification

## Model/migration alignment

The application model and immutable migration intentionally agree on:

| Concern | Contract |
|---|---|
| table | password_credentials |
| owner | authentication_identity_id |
| cardinality | one credential per AuthenticationIdentity |
| secret storage | password_hash only |
| lifecycle | active / disabled |
| timestamps | created_at / updated_at |
| deletion | credential cascades with its AuthenticationIdentity |

## Repository behavior

The persistence adapter is identity-scoped.

- create defaults status to active;
- lookup returns null when absent;
- password replacement updates by identity and distinguishes no match;
- status changes update by identity and distinguish no match.

Repository return values may contain passwordHash only inside the credential boundary. Account and profile projections must not reuse PasswordCredentialRecord as a general account DTO.

## Verification status

Focused repository behavior tests cover the no-match and identity-scoped update paths. Full migration execution remains CI/database-environment dependent and must not be inferred from static tests alone.
