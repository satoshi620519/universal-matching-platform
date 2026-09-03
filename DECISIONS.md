# Decisions

## Confirmed decisions

1. Build a Universal Matching Platform.
2. Target Web, iOS and Android.
3. Make the platform adaptable to multiple matching categories rather than only dating.
4. Prioritize safety, usability and internationalization.
5. Support country and regional operation so matching can work appropriately by geographic area.
6. Sell a finished, high-quality system/product rather than a simple beginner template.
7. Support both quick branding customization and deeper source-code customization.
8. Aim for established marketplaces where software/app templates can be sold internationally and potentially in Japan.
9. Prefer a buy-once/license-oriented business model initially to reduce long-term support obligations.
10. Provide thorough installation, administration, user and customization documentation for buyers.
11. Use GitHub as the project's persistent source of truth so development can continue even across different ChatGPT conversations.
12. Formal repository: universal-matching-platform.
13. Do not optimize the core product for a single use case; support multiple matching use cases through a shared configurable platform.
14. Support multiple matching methods rather than a single fixed method.
15. Version 1.0 is intended as a complete commercial product with Web, iOS, Android, backend, database, administration, configuration, and documentation.
16. Payment functionality is required.
17. Identity verification is required.
18. Global availability is a core requirement from the beginning.
19. ChatGPT is the primary development lead and directly manages repository work; Codex is used at major milestones for independent review, testing, security checks, and quality assurance.
20. Progress and continuity records must be updated frequently during development so work can resume accurately after interruption.

## Development continuity policy

- Record important progress as work proceeds, not only at the end of a session.
- Update the status record whenever a meaningful milestone, decision, implementation step, or interruption point is reached.
- Before ending any work session, record the exact next action and unfinished state.
- Do not rely on conversation memory as the sole source of project state.


## Phase 1 consistency review outcome — 2026-08-30

The Phase 1 requirements were reviewed across onboarding, categories, profiles, matching, messaging, notifications, payments, identity verification, safety, moderation, analytics, accessibility, operations, data lifecycle and buyer deployment.

### Confirmed cross-domain principles

21. Protected capabilities are centrally authorized server-side; clients may improve UX but are not the authority for payment, verification, safety or policy decisions.
22. Payment providers and identity-verification providers remain replaceable integrations; product requirements define capabilities before selecting vendors.
23. Safety enforcement must propagate through the same capability model used by entitlement and verification, preventing inconsistent behavior across Web, iOS and Android.
24. Category-specific behavior shall be configuration-driven where feasible, while shared trust, audit, account and safety foundations remain platform-wide.
25. Geographic operation shall be policy-aware and privacy-aware; precise location is not a prerequisite for general matching.
26. Analytics is an operational layer and not an unrestricted secondary copy of the transactional user database.
27. Buyer customization must have explicit supported boundaries so Quick Launch changes do not require modification of protected core modules.
28. Version 1.0 architecture shall prioritize a coherent modular monolith over premature microservice decomposition.

### Explicitly unresolved implementation decisions

The following are intentionally deferred to Phase 2 architecture work:
- Authentication provider and supported login methods.
- Payment provider selection and app-store/platform purchase integration boundaries.
- Identity-verification providers and regional coverage.
- Hosting/cloud topology and multi-region rollout strategy.
- Search technology.
- Realtime transport implementation.
- Analytics and observability vendor stack.
- Monorepo tooling.
- Jurisdiction-specific compliance implementation matrix.

Deferral is intentional. These decisions require detailed architecture, deployment constraints, regional analysis and implementation trade-off review rather than assumptions during product requirements planning.


## Technology stack baseline — 2026-08-30

29. Use TypeScript and Node.js LTS across the primary application stack.
30. Use pnpm workspaces with Turborepo for the monorepo.
31. Use Next.js for Web and Administration applications.
32. Use React Native + Expo for iOS and Android.
33. Use NestJS with Fastify for the modular-monolith backend API.
34. Use PostgreSQL as the authoritative relational database with Prisma for typed access and migrations.
35. Use Redis with BullMQ for initial queues/background jobs while retaining the transactional outbox reliability boundary.
36. Use Socket.IO behind a provider-neutral realtime gateway abstraction.
37. Use S3-compatible object storage abstraction.
38. Keep authentication provider-neutral and API-owned; start with email/password, verification and reset capabilities.
39. Use Vitest/Supertest/Playwright as the primary automated testing baseline, with Expo-compatible mobile tests.
40. Use Docker Compose for local supporting infrastructure and GitHub Actions for CI.
41. Keep deployment containerized and provider-neutral; payment, identity verification, messaging, production cloud, search and observability vendors remain explicit future adapter selections.


## Universal Configuration Engine boundaries — 2026-09-03

42. Quick Launch is the supported no-code purchaser configuration layer and uses versioned draft → validate → immutable publish semantics.
43. Advanced Customization is an explicit developer extension layer, not unrestricted modification of protected authorization, privacy, payment, verification or moderation boundaries.
44. Every future configuration domain must declare schema, defaults, Quick Launch visibility, extension contract, publication behavior, migration compatibility and authorization requirements before implementation.

45. Branding/Theme is the first Universal Configuration Engine domain expansion. It extends existing Quick Launch configuration semantics and must reuse M8 draft/publish/history behavior rather than introducing another version lifecycle.
46. Existing `primaryColor` and `logoUrl` remain backward-compatible launch-level fields while richer secondary/accent/typography values are introduced through the extensible BrandingThemeConfiguration contract.

47. Branding/Theme values are embedded in the existing versioned QuickLaunchDraft aggregate for the current commercial configuration model. They inherit the established draft → validate → immutable publish → supersede → history lifecycle; no separate endpoint, repository, or version counter is introduced.

48. Purchaser-facing branding/theme customization is exposed inside the existing Quick Launch Branding step and Review & Publish step. The workflow sends the richer contract through the existing create/save endpoints and preserves the single M8 publication lifecycle.

49. Published/history views use compact projections derived from immutable snapshots rather than duplicating full configuration state into separate summary persistence. Each configuration domain contributes display-safe summary fields only.
