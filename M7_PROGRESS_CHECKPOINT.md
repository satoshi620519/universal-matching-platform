# M7 Progress Checkpoint

## Purpose
Track M7 only. Inspect this checkpoint and current `main` before every change to prevent duplicate work.

## Boundary inventory
- VerificationRequest / VerificationOutcome persistence, repository/service/access layers, and lifecycle rules already exist.
- Provider-independent verification adapter boundary already exists; provider credentials/integration remain outside the domain.
- Entitlement domain state model already exists in `packages/domain/src/entitlement.ts`; do not reimplement it.
- Provider-neutral payment intent/result boundary already exists in `apps/api/src/payments/payment-provider.ts`.
- Provider-neutral webhook event/idempotency boundary already exists in `apps/api/src/payments/payment-webhook.ts`.
- Persistent webhook idempotency uses PostgreSQL `payment_webhook_idempotency` with atomic `ON CONFLICT DO NOTHING` claiming.
- M6 is not to be reimplemented unless a concrete CI/test failure appears.

## Completed
- Verification lifecycle transition contract and tests.
- Provider-independent verification request/result adapter boundary and tests.
- Provider-neutral payment intent/result contract and tests.
- Provider-neutral payment webhook contract and duplicate-delivery tests.
- Persistent payment webhook idempotency migration, Prisma/SQL adapter, and tests.
- Entitlement persistence migration `0021_create_entitlements`.
- Entitlement repository boundary and PostgreSQL-backed repository.
- Entitlement service for idempotent payment-intent grant, pending-to-active promotion, and state-validated revocation.
- Entitlement service tests for duplicate grant, pending promotion, and terminal-state revocation protection.
- Recent commits: `962e31baa268c84ff02f849a9216467ded2bc6a3`, `1c9ecbd95e3e584900b0f9ff7d063895743b3b77`, `42ed0a02e001a18bf099b0aa3464289449aa8273`, `296f69696bba9c3a39da96b0be20627ca3f100be`, `a661affa4eb7977414d9da776df23936b268d52d`, `f04820b21e5a72780e89f6201e5641fecb0c47e2`, `3b82f48d87d0c1e5edcbf210d1e863293fd08c34`, `8782efee878954cfd476eb106e0f075048993cff`.

## CI
- CI `33711702877` for persistent webhook idempotency commit `962e31baa268c84ff02f849a9216467ded2bc6a3`: completed successfully; baseline setup, migration integration, typecheck, lint, tests, matching concurrency integration/gate verification, and build all succeeded.
- Matching Concurrency Gate `33711702842`: completed successfully; isolated PostgreSQL concurrency evidence, attestation, and evidence upload succeeded.
- The entitlement commits added after `33711702877` require fresh CI verification; no green result is inferred until that execution is observed.

## Newly completed\n- Controller trust-boundary tests for unsigned and verified webhook handling.\n- End-to-end in-memory payment webhook flow tests for duplicate success delivery and provider-state mismatch.\n\n## Next exact task
Run fresh CI for the entitlement slice and inspect failures before making further changes. If green, connect `payment.succeeded` to entitlement grant through an explicit payment-intent lookup boundary (so webhook events do not trust provider payloads for account identity), then add the minimum integration tests for duplicate webhook delivery and entitlement grant/revocation. Do not treat payment failure/cancellation as revocation of an unrelated active entitlement without explicit intent linkage.
