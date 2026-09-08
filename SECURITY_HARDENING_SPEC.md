# SECURITY HARDENING SPECIFICATION

## Phase 19 purpose
Phase 19 performs evidence-based security hardening without duplicating the platform's existing authorization, validation, safety, rate-limit, and secret-management boundaries.

## Existing controls to preserve
- Server-authoritative capability authorization with deny precedence.
- Request validation before protected domain mutation.
- Request rate-limiter contract with privacy-conscious transport key derivation.
- Safety enforcement that cannot be bypassed by commercial entitlement.
- Secrets kept outside source control and provider-specific credentials isolated in configuration.
- Correlation-aware error handling and auditable administrative boundaries.

## Audit domains
1. Authentication and session lifecycle
2. Authorization and resource ownership
3. Input validation and error exposure
4. Rate-limit and abuse boundaries
5. File/media upload trust boundary
6. Secrets and deployment configuration
7. Database access and migration safety
8. API abuse and webhook verification
9. Privacy and observability boundaries
10. Dependency and release hygiene

## Hardening rules
- Fail closed when an authorization dependency is unavailable.
- Never expose secrets, credentials, raw verification evidence, or internal persistence objects in API errors/events.
- Do not add a fake media-upload pipeline before ownership, scanning, and durable storage contracts exist.
- Production distributed rate limiting must replace the process-local adapter without changing the application contract.
- Security fixes require focused regression tests where behavior is executable.

## Phase 19 acceptance
- [x] Existing security architecture and policy boundaries inventoried.
- [x] Authentication/session abuse audit completed (opaque 256-bit credentials, hash-only persistence, expiry/revocation enforcement, malformed credential rejection covered by tests).
- [x] Authorization/resource ownership audit completed (server-side guard boundary, authenticated principal validation, capability deny path and fail-closed architecture preserved; no demonstrated bypass found).
- [x] Validation/error disclosure audit completed (centralized production-safe unexpected-error response, correlation ID returned, HTTP boundary preserved; no raw internal stack exposure found).
- [x] Rate-limit abuse audit completed (contract preserved; invalid zero/negative/non-finite policies now fail closed with regression coverage).
- [x] Upload/media boundary explicitly verified and safely deferred (no authorized storage/scanning/ownership contract exists; arbitrary uploads remain intentionally unavailable).
- [x] Secrets/webhook/privacy audit completed (environment-isolated webhook secret, exact raw-body HMAC verification, timing-safe comparison, signed metadata projection, correlation-aware error boundary).
- [ ] Dependency/release hygiene documented.
- [ ] Fresh CI passes after demonstrated hardening changes.

## Non-goals
Do not rewrite mature subsystems merely to satisfy a checklist. Implement only concrete gaps demonstrated by repository evidence or tests.
