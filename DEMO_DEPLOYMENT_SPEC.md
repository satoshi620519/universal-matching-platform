# DEMO DEPLOYMENT SPECIFICATION

## Purpose

Phase 22 prepares a safe, reproducible demonstration environment without turning demo data or credentials into production defaults. The demo must prove the product to buyers while preserving the existing security and deployment boundaries.

## Scope

The Phase 22 acceptance target is:

- reachable web demonstration
- clearly separated demonstration accounts
- representative seeded data
- administrative demonstration access
- safe reset/reseed mechanism
- no production secrets or purchaser credentials committed to source control

This phase does not introduce a second application architecture or bypass authentication, authorization, moderation, or configuration controls.

## Existing foundation to reuse

The repository already contains:

- installation and environment templates
- API, web, and mobile applications
- administrative capability boundaries
- database migrations
- test/CI verification
- initial administrator provisioning boundaries

Phase 22 must build on those contracts rather than inventing demo-only authorization or parallel persistence.

## Demo environment model

Use a dedicated environment with its own:

- database
- storage configuration
- credentials/secrets
- deployment URLs

Demo configuration must never be interchangeable with production configuration.

## Demo accounts

Seed only non-sensitive fictional identities. Roles should include:

1. ordinary member A
2. ordinary member B
3. ordinary member C with a different profile shape/category where useful
4. administrator

Credentials must be injected through deployment secrets or generated at deployment/reset time. Real email addresses, personal data, API keys, signing material, and production credentials are forbidden.

## Representative data

The seed should exercise buyer-visible journeys:

- activated accounts
- completed configurable profiles
- discovery candidates
- likes/passes and at least one mutual-match path
- conversation/message history using synthetic content
- notifications
- report/moderation examples where safely supported
- configuration sufficient to demonstrate a non-hardcoded matching deployment

Do not seed private evidence, real user data, or content requiring special handling.

## Reset contract

Reset must be explicit and environment-guarded.

Minimum requirements:

1. refuse when the environment is not explicitly marked as demo
2. clear only the dedicated demo data store
3. reapply the current schema/migrations
4. reseed deterministic fictional baseline data
5. provision/reconcile the demo administrator through the existing provisioning boundary
6. report success/failure without printing secrets

A reset must not operate against a production database by default.

## Demo acceptance checklist

Before Phase 22 can close, verify:

- a fresh demo deployment can start from documented configuration
- member authentication works with provisioned demo credentials
- profile/discovery/match/conversation journeys are demonstrable
- administrative access uses normal capability authorization
- demo data is clearly fictional
- reset returns the environment to the documented baseline
- reset refuses an unmarked/non-demo environment
- no demo secrets are committed
- the existing CI remains green after repository changes

## Implementation order

1. Audit existing deployment and database bootstrap commands.
2. Identify the smallest reusable seed/provisioning primitives.
3. Add an environment-guarded demo seed/reset command only where a concrete gap exists.
4. Add focused regression coverage for the production-safety guard and deterministic reset boundary.
5. Document the actual demo deployment procedure.
6. Run CI and record the resulting evidence.

## Non-goals

- no fake production traffic
- no anonymous admin bypass
- no hardcoded marketplace credentials
- no public production reset endpoint
- no replacement of the existing migration/auth/admin architecture
