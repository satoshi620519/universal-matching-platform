# Technical Architecture Draft

## Status
Draft — awaiting architecture review and approval before implementation.

## Design principles
- Global commercial product from day one.
- Web, iOS and Android are first-class clients.
- Shared domain logic where practical, without forcing identical UI across platforms.
- Modular monolith first; clear boundaries for future service extraction.
- PostgreSQL as the transactional source of truth.
- Configuration-driven product behavior for buyer customization.
- Security, privacy, moderation and auditability are foundational.

## Recommended high-level architecture
Clients: Next.js + TypeScript for Web and Admin; React Native + Expo + TypeScript for iOS/Android.
Platform: NestJS + TypeScript API; PostgreSQL primary database; Redis for cache/queues/rate limiting; S3-compatible object storage; authorized realtime layer; background workers.
External integrations: provider abstraction layers for payments, identity verification, email/SMS/push.

## Monorepo structure
- apps/web
- apps/mobile
- apps/admin
- apps/api
- apps/worker
- packages/ui
- packages/domain
- packages/api-client
- packages/config
- packages/i18n
- packages/types
- docs
- infrastructure

## Core backend modules
auth, accounts, profiles, discovery, matching, messaging, notifications, geography, localization, payments, identity-verification, safety, moderation, administration, configuration, media, analytics, audit.

## Matching architecture
Strategy-based, not hard-coded. Support mutual like, swipe/card discovery, search/filter discovery, rule/criteria matching, scoring, and future recommendation models. Deployments can enable or disable strategies.

## Geographic architecture
Store normalized geographic hierarchy separately from precise user location. Support regions, countries, subdivisions, cities and configurable service areas. Precise coordinates are privacy-controlled and not public by default.

## Configuration architecture
Separate platform defaults, deployment configuration, category configuration and brand configuration. Buyer-facing settings should control branding, languages, geography, profile schema, discovery methods, matching rules, verification requirements, moderation policy and feature availability without source-code edits where feasible.

## Security baseline
Least privilege; server-side authorization; data access controls; encryption in transit; protected secrets; audit logging; rate limiting; abuse prevention; private authorization for realtime channels; replaceable provider adapters.

## Open architecture decisions
1. Exact payment provider strategy and regional fallback model.
2. Exact identity verification provider strategy and coverage matrix.
3. Cloud/deployment provider and multi-region rollout plan.
4. Search engine choice for advanced discovery.
5. Monorepo tooling selection.
6. Observability stack.

## Next step
Review this draft against full product requirements, then convert approved decisions into ARCHITECTURE.md and DECISIONS.md before implementation.
