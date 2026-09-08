# DEVELOPER EXTENSIBILITY GUIDE

## Purpose
This guide identifies supported customization boundaries for source-product buyers. Extend contracts and adapters; avoid patching persistence internals.

## Stable extension points
### Provider adapters
Replace infrastructure integrations behind existing application contracts, including payment, verification, email, notification, and realtime delivery. Register replacements through Nest dependency injection and preserve the contract's failure semantics.

### Domain strategies
Customize matching and policy behavior through the existing strategy/service contracts. Do not bypass authorization or mutate repositories directly from a strategy.

### Outbound extension events
Use `OutboundExtensionEventPublisher` to connect optional external consumers.

A public event contains:
- `id` — immutable event identifier
- `type` — stable event name
- `schemaVersion` — payload contract version
- `occurredAt` — event timestamp
- `correlationId` — optional request trace identifier
- `payload` — minimal public data only

The default publisher is a no-op, so external delivery is optional. A custom publisher should isolate delivery failures, support consumer idempotency using `id`, and never expose raw credentials, ORM entities, or internal persistence objects.

### Configuration
Prefer the existing deployment/configuration boundaries before editing source. Secrets remain environment/deployment configuration and must not be emitted in extension events.

## API compatibility
- New stable public endpoints use `/api/v1`.
- Existing routes remain compatible until explicitly deprecated.
- Prefer additive changes.
- Breaking changes require a new major API version.
- Preserve the platform error and correlation-ID contract.

## Explicitly unsupported
- Direct Prisma/database repository access as a plugin API.
- Reimplementing payment webhook ingestion for outbound integrations.
- A mandatory third-party plugin runtime.
- Arbitrary payloads containing credentials, secrets, or internal persistence objects.

## Safe customization workflow
1. Identify the existing contract or adapter.
2. Add an implementation rather than editing unrelated domain persistence.
3. Keep authorization and safety enforcement server-side.
4. Add focused tests for the replacement contract.
5. Run the repository CI gates before distribution.

See `API_AND_DEVELOPER_EXTENSIBILITY_SPEC.md` for the Phase 18 acceptance contract.
