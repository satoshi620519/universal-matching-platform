# Mobile Registration API Alignment Report

## Repository inspection result
The current backend contains explicit account activation endpoints:

- PATCH /accounts/:accountId/activation
- PATCH /accounts/authenticated/activation

The authenticated activation route resolves the caller from the Authorization header.

## Important finding
A dedicated mobile-ready public registration/email-verification HTTP controller was not confirmed during this inspection. The mobile client must therefore NOT invent POST /auth/register or verification endpoint names.

## Implementation decision
Registration UI is deferred until the backend's actual public registration contract is located or implemented.

The next safe mobile vertical slice is protected navigation, because the authenticated session contract already exists and does not require inventing backend APIs.

## Follow-up backend contract gate
Before registration UI is implemented, confirm:
1. public registration endpoint
2. request DTO
3. duplicate-account behavior
4. verification trigger
5. verification completion endpoint
6. post-verification authentication behavior
