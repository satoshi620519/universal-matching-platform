# Implementation Milestones

## Status
Phase 3 implementation planning artifact.

## Purpose
Translate the approved product requirements and Phase 2 architecture into dependency-ordered, testable vertical milestones. A milestone is complete only when its completion gate is satisfied and project status is updated.

## Planning rules

1. Do not start a later milestone merely because it is attractive; satisfy dependencies first.
2. Prefer vertical slices that exercise real boundaries over isolated UI-only construction.
3. Reuse approved architecture; do not recreate completed design documents.
4. Every milestone has explicit tests and documentation/status gates.
5. New major decisions are recorded in DECISIONS.md before dependent irreversible implementation.
6. Scope expansion requires an explicit milestone update.

# Milestone 0 — Repository and engineering foundation

## Goal
Create the runnable monorepo foundation and shared development workflow.

## Deliverables
- workspace/package structure aligned with ARCHITECTURE.md;
- TypeScript baseline;
- formatting and linting;
- unit test runner;
- environment configuration conventions;
- CI baseline;
- database migration tooling;
- local developer startup documentation.

## Dependencies
None beyond approved architecture.

## Completion gate
- clean checkout can install dependencies;
- lint executes;
- test command executes;
- minimal application/service health path runs;
- CI validates baseline checks.

# Milestone 1 — Core API, database and identity

## Goal
Establish the authoritative request and transactional boundary.

## Deliverables
- API runtime;
- database connection/migrations;
- account identity model;
- authenticated request context;
- initial authorization engine integration;
- structured errors;
- correlation identifiers;
- audit baseline.

## Completion gate
- authenticated and unauthenticated paths tested;
- migration from empty database tested;
- authorization denial tested;
- API error contract tested.

# Milestone 2 — Configuration resolution

## Goal
Make controlled product variation available before category/product features multiply.

## Deliverables
- typed configuration schemas;
- default/deployment/category/region resolution baseline;
- draft validation;
- published immutable versions;
- safe effective configuration projection.

## Completion gate
- precedence tests;
- invalid configuration rejected;
- published version immutable;
- rollback/reversion path tested.

# Milestone 3 — Profiles, categories and geography

## Goal
Create the minimum reusable identity representation for multiple matching categories.

## Deliverables
- category model;
- configurable profile schema baseline;
- profile creation/update;
- geography scope;
- localization-ready fields;
- privacy-aware profile projections.

## Completion gate
- category-specific profile validation tested;
- unauthorized field exposure tested;
- geographic scope validation tested.

# Milestone 4 — Discovery and matching

## Goal
Deliver the first end-to-end matching value.

## Deliverables
- discovery queries;
- configurable eligibility filtering;
- initial strategy interface;
- mutual match/state transitions;
- block/safety-aware exclusions;
- pagination and concurrency handling.

## Completion gate
- eligibility tests;
- blocked subject exclusion;
- duplicate/concurrent match transition tests;
- API pagination tests.

# Milestone 5 — Messaging and notifications

## Goal
Allow authorized matched/eligible participants to communicate reliably.

## Deliverables
- conversation/message domain;
- message APIs;
- notification records;
- transactional outbox;
- worker baseline;
- initial realtime delivery;
- reconnect/reconciliation path.

## Completion gate
- duplicate event processing tested;
- unauthorized conversation access denied;
- missed realtime event recoverable through API;
- worker retry behavior tested.

# Milestone 6 — Trust, safety and moderation

## Goal
Make safety controls operational before broad production exposure.

## Deliverables
- block/report;
- moderation case lifecycle;
- enforcement actions;
- audit events;
- abuse/rate-limit baseline;
- privacy-aware operational access.

## Completion gate
- enforcement immediately affects authorization;
- blocked interactions prevented;
- report access scoped;
- privileged actions audited.

# Milestone 7 — Verification and commerce

## Goal
Add controlled identity assurance and monetization boundaries.

## Deliverables
- verification state machine/provider adapter;
- payment adapter boundary;
- entitlement model;
- webhook/idempotency handling;
- entitlement authorization integration.

## Completion gate
- duplicate provider webhook safe;
- payment secrets excluded from domain projections;
- entitlement grant/revocation tested;
- verification failure states tested.

# Milestone 8 — Purchaser administration and Quick Launch

## Goal
Deliver the commercial customization experience promised by the product.

## Deliverables
- administrative console baseline;
- branding configuration;
- geography/category controls;
- feature controls;
- onboarding/profile configuration;
- configuration publication workflow.

## Completion gate
- administrator capability boundaries tested;
- high-impact configuration audited;
- effective runtime configuration changes verified;
- ordinary Quick Launch changes require no source modification.

# Milestone 9 — Media, analytics and operational hardening

## Goal
Prepare production operations without making telemetry the source of truth.

## Deliverables
- media upload/storage boundary;
- processing jobs;
- analytics event pipeline;
- dashboards/operational metrics;
- backup/restore strategy;
- dead-letter investigation workflow.

## Completion gate
- sensitive data minimization reviewed;
- async failures observable;
- restore procedure exercised;
- media authorization tested.

# Milestone 10 — Cross-platform clients

## Goal
Complete Web, iOS and Android experiences against stable shared contracts.

## Deliverables
- Web application;
- React Native/Expo mobile application;
- shared API client/types;
- localization;
- accessibility baseline;
- responsive/mobile UX.

## Completion gate
- critical flows pass on all target clients;
- contract compatibility tested;
- unauthorized states handled consistently;
- realtime fallback works on each client.

# Milestone 11 — Integration, security and release readiness

## Goal
Turn implemented features into a releasable Version 1.0 candidate.

## Deliverables
- end-to-end critical-path tests;
- security review/remediation;
- performance/load baseline;
- accessibility review;
- privacy/retention implementation review;
- deployment runbook;
- purchaser documentation;
- incident/rollback procedures.

## Completion gate
- release checklist complete;
- critical vulnerabilities resolved or explicitly accepted;
- backup/restore tested;
- production rollback tested;
- documentation complete;
- final status records updated.

# Dependency graph

M0
 ↓
M1
 ↓
M2
 ↓
M3
 ↓
M4
 ↓
M5 ──→ M6
 ↓       ↓
M7      ↓
 ↓       ↓
M8 ←────┘
 ↓
M9
 ↓
M10
 ↓
M11

Some work can later run in parallel, but parallelization must not violate the authoritative dependency boundaries.

# Standard completion protocol

For every milestone:

1. Confirm current DEVELOPMENT_STATUS.md and relevant architecture artifacts.
2. Implement only milestone scope.
3. Run required tests.
4. Record significant decisions in DECISIONS.md.
5. Update DEVELOPMENT_STATUS.md with:
   - completed work;
   - files changed;
   - tests executed;
   - known issues;
   - next exact task.
6. Commit coherent changes.

A milestone is not complete solely because code exists.

# Exact next step

Before implementation begins, create TECHNOLOGY_STACK_DECISION.md selecting the concrete baseline for:
- monorepo/build tooling;
- backend runtime/framework;
- web framework;
- mobile framework;
- PostgreSQL ORM/query layer;
- authentication approach;
- queue/background job mechanism;
- realtime transport;
- testing stack;
- deployment baseline.

Each selection must be justified against the approved architecture and recorded as explicit decisions.
