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
- CI `33714851556` completed successfully after Stripe webhook payload narrowing: baseline checks passed, including migration integration, typecheck, lint, tests, matching concurrency integration/gate verification, and build.
- CI `33714714076` failed at Typecheck in the new Stripe webhook adapter because nested `data.object` remained inferred as `{}` after narrowing. Fixed with explicit record narrowing before field projection (`fa0085060f8b7874d126ebd95a98ab2da3c17627`); await fresh CI before composition work.
- CI `33714389959` completed successfully after the final PostgreSQL fixture alignment: migration integration, typecheck, lint, tests, matching concurrency integration/gate verification, and build all passed.

## Provider composition progress
- CI `33715122185` completed successfully for provider selection/configuration: baseline checks passed across migration integration, typecheck, lint, tests, concurrency verification, and build.
- Fetch-based Stripe HTTP infrastructure boundary added without introducing a Stripe SDK (`30b14d434261ae19ca006cb425b1ff9e3d5facab`) with non-2xx and malformed-JSON failure tests (`d9427fd8765b7c6c63c8f16037679df0c9fb7b51`).
- Nest composition now selects local adapters by default or Stripe adapters only when validated `PAYMENT_PROVIDER=stripe` configuration is present (`560eae4fe238575987e06264ed44f5292a09b40e`), with composition contract tests (`8ae7690ff4c211ab12cc6abd30b97fbe361b1d0c`).
- Explicit provider selection config added: `PAYMENT_PROVIDER=local|stripe`; Stripe mode fails closed unless both `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are present (`3c63c21bcc8f780bdd9c7be576baca4e9734d7d7`) with configuration failure tests (`62d7a6ce2a2052257db471e0c774908b2f0520c5`).
- Environment-backed Stripe webhook secret boundary added (`67b2878fda6f5045192f05cbc8dfeb57cfcc5d2e`).

## Provider adapter progress
- Stripe provider-specific adapter added behind the existing `PaymentProvider` contract; no SDK types leak into domain code (`a64addf92bbc8e02d4b647e7f9a7d2955b919d29`) with contract tests (`c14badbf6fb8a8f9eac3e08ed299796d5c0dee8e`).
- Stripe signed webhook transport added behind `VerifiedPaymentWebhookTransport`; verifies signature before projecting provider event + signed metadata into neutral context (`49ab6efc3292c6e7f2e3ac7f082c8c56b566fca9`) with tamper/context rejection tests (`5cea0034c7f11e8ba1f74457f2e595880c0e4f85`).

## CI
- Fresh CI `33713568044` completed successfully after the contract fixes: migration integration, typecheck, lint, tests, matching concurrency integration/gate verification, and build all passed.
- CI `33711702877` for persistent webhook idempotency commit `962e31baa268c84ff02f849a9216467ded2bc6a3`: completed successfully; baseline setup, migration integration, typecheck, lint, tests, matching concurrency integration/gate verification, and build all succeeded.
- Matching Concurrency Gate `33711702842`: completed successfully; isolated PostgreSQL concurrency evidence, attestation, and evidence upload succeeded.
- Fresh CI `33713276148` failed at Typecheck (not migration): two webhook-flow test fixtures omitted required `accountId`/`idempotencyKey`, and the verified transport imported a removed controller export. Both issues were fixed in `bbbf50e63ad263f426a69055abd4d924f8bf9a75` and `ce5a7e32d71f8ff59be63f362160eed656d7aad1`; await the resulting CI before further feature work.

## CI
- CI `33714168217` reached the PostgreSQL revocation assertion and exposed one remaining fixture mismatch: repository transition updates `entitlements.updated_at`, absent from the focused test schema. Added `updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP` to the test fixture in `80f804adb45c68f75c2e9ae6812765a6ca5acbf2`; await fresh CI.
- CI `33714013547` reached Test and exposed that the ordinary test command uses a fresh PostgreSQL without the focused M7 tables. The integration test now provisions only its required focused schema (`payment_webhook_idempotency`, `entitlements`, and minimal `accounts`) inside setup, keeping migration-command integration separate. Fix: `e75a1516b3c9e7b6477dd3e9da85a4bb946384ee`; await fresh CI.
- CI `33713820387` exposed a real PostgreSQL integration fixture gap: the focused M7 migration setup does not create `accounts`, while entitlements retain an FK to it. Fixed by creating only the minimal `accounts(id UUID PRIMARY KEY)` FK fixture inside the integration test (`eb6c4f62d8caa0033b3eb824d0c8dd39bd48c5a1`); await fresh CI.

## Newly completed
- Explicit entitlement lookup and revocation by payment-intent linkage; unrelated entitlements are not guessed or revoked.
- Revocation isolation test covering multiple payment intents.
- Controller trust-boundary tests for unsigned and verified webhook handling.\n- End-to-end in-memory payment webhook flow tests for duplicate success delivery and provider-state mismatch.\n\n## Completion push checkpoint
- User requested completion acceleration on 2026-09-03. Continue from this checkpoint; do not repeat completed M7 work.
- Latest CI `33715396428` for HTTP/composition work was still running when the completion push began; do not assume its result.
- Stripe webhook audit found the previous implementation signed `JSON.stringify(payload)`, which is unsafe for provider signatures because reserialization can alter authenticated bytes.
- Raw-body verification capability added to the provider-neutral transport (`f71ba4c0086ddbd5c8871294637e2db214b8a263`).
- Stripe adapter now requires exact raw body and supports `v1=` signature extraction with timing-safe comparison (`c5358396af210898f74d69280952388ab2a2c202`).
- Focused tests cover versioned signature acceptance, tampering, missing raw-body rejection, and missing signed context (`1cf00105e32f3005debf40bdd44775105ce1eb2c`).
- Controller forwards provider signature and raw-body capability (`24c4169e5b915ddc1f8409102b1033da0e375132`).

## Next exact task
- CI `33715396428` for HTTP/composition work completed SUCCESS.
- CI `33715550436` exposed exactly one Typecheck error in the new raw-body Stripe signature path: `actual` was `string | null` before `Buffer.from`. Fixed by narrowing before conversion (`33dc6020beeb0401077866c644b7a9bad1b6d35e`).
- Focused controller wiring test added (`ea384660152a90bfc1378f291d76bf679c46592b`).
- Latest CI `33715702998` is in progress for the preceding typecheck fix and controller tests; do not assume result yet.
- Production-grade raw-body capture has now been wired at the Fastify/Nest bootstrap with `{ rawBody: true }` (`44c21362110ef535d8b3c3527c58ffe53076f3cd`).
- Webhook controller no longer accepts an arbitrary `x-raw-body` header; it reads the framework-captured `request.rawBody` (`ea317687cac43df2d88a14fa4a5edf34df366e78`) with focused captured-buffer tests (`53e7044911b7254f20a3e16885aa887d9e94304f`).
- CI `33715860271` failed at Typecheck with one stale focused test call still passing a raw-body string where the controller now expects a captured request object. Fixed only the test invocation (`626e7d967b06aee385610c650fcf9a0980c2fdec`).
- Inspect fresh CI for `626e7d96` plus the preceding production raw-body commits. If green, perform final M7 roadmap/status audit and update DEVELOPMENT_STATUS.md; if a new failure appears, fix only that exact issue.
