# Technology Stack Decision

## Status
Phase 3 planning decision — implementation baseline.

## Decision goal
Select a coherent, commercially maintainable baseline that matches the approved architecture without prematurely locking the product to a single cloud vendor or external business provider.

# 1. Selected baseline

| Concern | Decision |
|---|---|
| Language | TypeScript |
| Runtime | Node.js LTS |
| Package manager | pnpm |
| Monorepo orchestration | Turborepo |
| Web application | Next.js |
| Administration console | Next.js |
| Mobile | React Native + Expo |
| Backend API | NestJS |
| HTTP adapter | Fastify |
| Database | PostgreSQL |
| Database access | Prisma ORM |
| Cache / ephemeral coordination | Redis |
| Background jobs | BullMQ |
| Realtime | Socket.IO behind a gateway abstraction |
| Object storage | S3-compatible abstraction |
| Unit/integration tests | Vitest |
| API/e2e tests | Vitest + Supertest |
| Browser e2e tests | Playwright |
| Mobile testing | Jest/React Native Testing Library where Expo-compatible |
| Lint/format | ESLint + Prettier |
| CI | GitHub Actions |
| Local infrastructure | Docker Compose |
| Deployment baseline | Containerized, provider-neutral |

# 2. Monorepo

Use pnpm workspaces and Turborepo.

Reason:
- shared TypeScript types/contracts;
- shared configuration and tooling;
- separate deployable applications;
- efficient task caching;
- broad ecosystem support.

Initial workspace structure follows ARCHITECTURE.md.

Do not create independent repositories for Web, Admin, Mobile and API unless a future commercial or operational requirement justifies it.

# 3. Web and administration

Use Next.js with TypeScript for:
- apps/web;
- apps/admin.

Reason:
- mature React ecosystem;
- suitable for responsive application UX;
- strong TypeScript integration;
- commercial developer familiarity;
- separate applications can share UI primitives without forcing identical UX.

Admin remains a separate application boundary even when sharing packages.

# 4. Mobile

Use React Native with Expo and TypeScript.

Reason:
- one primary mobile codebase for iOS and Android;
- faster commercial product development;
- large ecosystem;
- supports shared TypeScript contracts with backend/web.

Native escape hatches remain available when required.

# 5. Backend

Use NestJS with the Fastify adapter.

Reason:
- modular structure aligns with bounded contexts;
- dependency injection and testability;
- explicit controllers/services/modules;
- TypeScript end-to-end;
- Fastify provides a performant HTTP foundation.

The backend remains a modular monolith initially.

Do not introduce microservices as a default implementation strategy.

# 6. Database and data access

Use PostgreSQL with Prisma ORM and migrations.

Reason:
- strong relational integrity;
- suitable for transactional matching, payments, entitlements and audit data;
- Prisma provides typed access and migration tooling;
- PostgreSQL remains directly accessible for carefully reviewed advanced queries.

Rules:
- Prisma models do not define domain boundaries by themselves;
- migrations are version-controlled;
- transaction boundaries follow domain invariants;
- sensitive data separation remains architectural, not merely ORM-level.

# 7. Authentication

Use an authentication abstraction owned by the API.

Initial supported baseline:
- email/password capability with secure password hashing;
- email verification;
- password reset;
- refresh/session lifecycle;
- provider-neutral interface for future OIDC/social login.

The project will not hardwire core domain authorization to a frontend authentication vendor.

Reason:
- commercial buyers may require different identity providers;
- Web and mobile require consistent server-side subject identity;
- provider replacement must remain feasible.

Concrete social/OIDC providers are deferred until buyer/market requirements justify them.

# 8. Authorization

No third-party authorization engine is selected as a mandatory dependency initially.

Implement the approved central capability evaluation model inside the backend architecture with explicit interfaces.

Reason:
- the authorization model is product-specific and cross-cuts safety, verification and entitlements;
- premature external policy-language adoption would add operational complexity.

A dedicated library may be adopted later only if it demonstrably reduces complexity without weakening the approved deny-precedence model.

# 9. Redis and background jobs

Use Redis for:
- BullMQ queues;
- rate-limit coordination;
- selected ephemeral/cache use cases.

Use BullMQ for initial durable application jobs.

Reason:
- natural fit for Node.js;
- adequate for the initial modular monolith;
- avoids premature distributed streaming infrastructure.

Transactional outbox remains the source for reliable transition from committed database state into asynchronous work.

# 10. Realtime

Use Socket.IO behind the provider-neutral realtime gateway interface.

Reason:
- mature reconnection behavior;
- rooms/subscriptions suitable for scoped conversations and notifications;
- broad client support;
- practical Web and React Native integration.

The domain layer never directly depends on Socket.IO semantics.

HTTP reconciliation remains mandatory.

# 11. Object storage

Define an S3-compatible storage adapter.

Reason:
- broad cloud compatibility;
- self-hosted and commercial deployment flexibility;
- avoids coupling buyers to a single provider.

Media authorization and signed-access behavior remain backend controlled.

# 12. Testing

Testing pyramid:

1. Vitest unit tests for domain and package logic.
2. Integration tests against real infrastructure where transaction behavior matters.
3. API tests using Supertest.
4. Browser end-to-end tests using Playwright.
5. Mobile component/flow tests using Expo-compatible Jest tooling.

Critical paths require integration coverage rather than mocks alone:
- authorization;
- transactions;
- outbox;
- idempotency;
- configuration precedence;
- safety enforcement.

# 13. Local development

Use Docker Compose for supporting services:
- PostgreSQL;
- Redis;
- optional local S3-compatible storage emulator.

Applications run with documented development commands.

A new contributor should be able to start required infrastructure without manually installing database or queue servers.

# 14. CI

Use GitHub Actions.

Initial required checks:
- dependency install;
- typecheck;
- lint;
- unit tests;
- integration tests where CI service containers are available;
- build.

Later milestones add:
- end-to-end tests;
- security/dependency scanning;
- migration validation.

# 15. Deployment baseline

Deploy applications as containers.

The initial architecture is provider-neutral and must support:
- managed PostgreSQL;
- managed Redis;
- S3-compatible object storage;
- container execution platform.

No single cloud provider is required for core architecture.

Production topology and multi-region rollout remain separate operational decisions.

# 16. Explicitly deferred choices

These are intentionally not selected yet because the adapter boundaries permit later choice:
- payment provider;
- identity-verification provider;
- transactional email/SMS/push providers;
- production cloud vendor;
- search engine beyond PostgreSQL baseline;
- observability vendor;
- CDN provider;
- jurisdiction-specific compliance services.

Deferral is not absence of architecture: interfaces and domain boundaries prevent these choices from blocking M0/M1.

# 17. Compatibility principles

- Node.js versions follow active LTS policy.
- Package versions are pinned through lockfile and reviewed updates.
- Public API contracts are versioned.
- External providers remain adapter-based.
- Infrastructure is reproducible from version-controlled configuration.

# 18. Implementation consequence

The first implementation milestone (M0) now has a concrete baseline:

pnpm + Turborepo
→ TypeScript workspaces
→ Next.js Web/Admin
→ Expo mobile
→ NestJS/Fastify API
→ PostgreSQL/Prisma
→ Redis/BullMQ
→ Socket.IO abstraction
→ Docker Compose
→ Vitest/Playwright
→ GitHub Actions

# Exact next step

Start Milestone 0 implementation by creating the monorepo workspace and engineering foundation. Before coding, record the exact M0 file structure and acceptance checklist in DEVELOPMENT_STATUS.md; then implement only M0 scope.
