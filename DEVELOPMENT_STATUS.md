# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Phase 1 requirement-contract foundation is complete; begin Milestone 1 implementation by turning the existing architecture into the first runnable API/database/authenticated-request vertical slice.
STATUS: Requirement-contract foundation complete; Milestone 1 runnable vertical slice in progress

## Latest checkpoint — 2026-08-31
- Privacy-preserving Safety Metric type fix CI #139 passed: install, typecheck, lint, test and build all green.
- Safety Metric is CI-validated and complete; progress-record CI #140 also passed.
- Analytics Governance Access Policy implemented for role-controlled analytics operations (REQ-AN-019, foundations for REQ-AN-021/022/023).
- Analytics Governance tests implemented.
- Analytics report privacy controls implemented for REQ-AN-020 with deterministic suppression/aggregation behavior.
- Analytics report privacy control tests implemented.
- Analytics report privacy controls CI #147 passed: install, typecheck, lint, test and build all green; progress record CI #148 also passed.
- Analytics report privacy controls are CI-validated and complete.
- Auditable Analytics Actions implemented for export and dashboard configuration, mapped onto the existing Audit Record foundation.
- Auditable Analytics Action tests implemented.
- Auditable Analytics Actions CI passed: implementation CI #151 and progress record CI #152 both green.
- Auditable Analytics Actions are CI-validated and complete.
- Analytics Deployment Retention Policy implemented for REQ-AN-023 with explicit supported retention periods and deployment-level non-essential analytics disable control.
- Analytics Deployment Retention Policy tests implemented.
- Analytics Deployment Retention Policy CI #155 passed: install, typecheck, lint, test and build all green; progress record CI #156 also passed.
- Analytics requirements slice is CI-validated and complete through REQ-AN-023.
- Accessibility Control Contract implemented for REQ-A11Y-001 and REQ-A11Y-002 foundations: accessible name, role, state metadata and keyboard/platform-equivalent navigation.
- Accessibility Control Contract tests implemented.
- Accessibility Control Contract CI #159 passed: install, typecheck, lint, test and build all green.
- Accessibility Flow Communication Contract implemented for REQ-A11Y-003 through REQ-A11Y-006 foundations: non-sensory information channel, text scaling, predictable visible focus, and dynamic status mechanism.
- Accessibility Flow Communication Contract tests implemented.
- Initial CI failed at typecheck because the test fixture widened informationChannels to string[].
- Fixed by preserving literal channel types with a readonly tuple; no domain rule was changed.
- Replacement CI #165 passed and progress record CI #166 also passed; Accessibility Flow Communication Contract is CI-validated.
- Accessibility Assurance Contract implemented for REQ-A11Y-007 through REQ-A11Y-010: time-limit alternatives, important visual text alternatives, supported platform preference respect, and major user-flow accessibility acceptance.
- Accessibility Assurance Contract tests implemented.
- Accessibility Assurance Contract CI #169 passed and progress record CI #170 also passed; Accessibility requirements slice REQ-A11Y-001 through REQ-A11Y-010 is CI-validated and complete.
- Operational Performance Target Contract implemented for REQ-NFR-007, REQ-NFR-008 and REQ-NFR-010 foundations: per-journey targets, all critical journeys, and explicit latency dimensions.
- Operational Performance Target Contract CI #173 passed and progress record CI #174 also passed; performance requirements foundation is CI-validated.
- Operational Resilience Contract implemented for REQ-NFR-009, REQ-NFR-011, REQ-NFR-012 and REQ-NFR-013: non-blocking background operations, degraded critical dependencies, optional failure isolation, and bounded observable retries.
- Operational Resilience Contract CI #177 passed and progress record CI #178 also passed; resilience foundation is CI-validated.
- Operational Observability and Recovery Contract implemented for REQ-NFR-014 through REQ-NFR-020: actionable failure signals, backup/recovery/rollback readiness, structured operation records, correlation support, sensitive-content minimization, and healthy/degraded/failed states.
- Operational Observability and Recovery Contract CI #181 passed and progress record CI #182 also passed; Operational Quality requirements through REQ-NFR-020 are CI-validated and complete.
- Data Lifecycle Retention Contract implemented for REQ-DATA-001 through REQ-DATA-005: documented data-class purposes, user deletion lifecycle, scoped retention exceptions, distinct lifecycle actions, and backup expiration/recovery lifecycle.
- Data Lifecycle Retention Contract CI #185 passed and progress record CI #186 also passed; retention/deletion foundation is CI-validated.
- Data Lifecycle Governance Contract implemented for REQ-DATA-006 through REQ-DATA-010: derived-data re-identification review, sensitive evidence protection, explainable deletion states, retention policy change traceability, and observable failure-aware lifecycle jobs.
- Data Lifecycle Governance Contract CI #189 passed and progress record CI #190 also passed; Data Retention and Deletion requirements through REQ-DATA-010 are CI-validated and complete.
- Deployment Installation Contract implemented for REQ-DEPLOY-001 through REQ-DEPLOY-005: documented prerequisites, externalized environment configuration, safe secret handling, quick-launch versus advanced customization guides, and documented integration requirements.
- Deployment Installation Contract CI #193 passed and progress record CI #194 also passed; installation foundation is CI-validated.
- Deployment Readiness Contract implemented for REQ-DEPLOY-006 through REQ-DEPLOY-010: readiness checklists, documented buyer configuration surfaces, upgrade/migration/rollback planning, production responsibility assignment, and extension boundaries that avoid unnecessary core forks.
- Deployment Readiness Contract CI #197 passed and progress record CI #198 also passed; Buyer Installation and Deployment requirements through REQ-DEPLOY-010 are CI-validated and complete.
- Phase 1 consistency review confirmed the requirement contracts align with the existing bounded-context, data, API and event architecture; no new irreversible product decision is required before implementation.
- Architecture baseline is already established in DOMAIN_MODEL.md, DATA_MODEL_DRAFT.md, API_ARCHITECTURE.md, EVENT_AND_ASYNC_ARCHITECTURE.md, IMPLEMENTATION_MILESTONES.md and TECHNOLOGY_STACK_DECISION.md.
- Current immediate action: begin Milestone 1 runnable vertical slice without recreating completed requirement contracts or architecture artifacts.
- Milestone 1 API foundation slice implemented: typed runtime configuration, health/readiness service, database configuration awareness, and correlation ID propagation. CI pending.
- API bootstrap implementation CI #207 passed; progress checkpoint CI #208 remains the latest status-record run.
- Database foundation CI #217 passed after the targeted Prisma Client generation fix; database baseline is CI-validated.
- Account repository and structured API error boundary follow-up CI #229 reached API typecheck and exposed one remaining persistence/domain boundary mismatch: Prisma persisted status is string while AccountRecord requires AccountState.
- Repository status mapping fix CI #230 passed and progress record CI #231 passed; repository/error boundary slice is CI-validated.
- Provider-neutral authenticated request context CI #235 passed and progress record CI #236 passed; authentication context boundary is CI-validated.
- Authentication adapter/unauthorized boundary CI #240/#241 failed at API test typecheck only: a test adapter override omitted the required input parameter and a matcher used an unsupported generic type argument.
- Targeted test-only fixes applied; production authentication adapter and guard contracts were unchanged. Follow-up CI pending.
- Database foundation remains: Prisma/PostgreSQL schema baseline, explicit database configuration guard, and NestJS database service lifecycle.
- Next implementation slice after database CI: repository boundary and structured API error boundary, then authenticated request context.
- Do not recreate any completed item below.

## Completed — DO NOT RECREATE
- Project foundation and continuity rules established.
- GitHub is the persistent source of truth.
- Milestone 0 engineering foundation and CI baseline.
- M1 canonical domain primitives and tests.
- API application boundary.
- Database configuration/migration boundary.
- Capability gate and tests.
- Account lifecycle and tests.
- Account activation service and tests.
- Capability access service and tests.
- Domain package public entrypoint/workspace exports.
- Entitlement lifecycle and tests.
- Verification domain lifecycle and tests.
- Verification lifecycle CI validation (CI #98).
- Verification access application service and tests.
- Verification access service CI validation (CI #101).
- Safety restriction domain policy and tests.
- Safety restriction CI validation (CI #102).
- Safety report lifecycle and tests.
- Safety report lifecycle CI validation (CI #109).
- Moderation case lifecycle and tests.
- Moderation case lifecycle CI validation.
- Moderation action policy and tests.
- Moderation action policy CI validation (CI #118).
- Audit record domain model and tests.
- Audit record domain model CI validation.
- Analytics event taxonomy model and tests.
- Analytics event taxonomy CI validation (CI #124).
- Metric definition model and tests.
- Metric definition model CI validation.
- Metric report result model and tests.
- Metric report result model CI validation.
- Privacy-preserving safety metric model and tests.
- Privacy-preserving safety metric type fix and CI validation (CI #139).
- Analytics governance access policy and tests.
- Analytics report privacy suppression/aggregation controls and tests.
- Auditable analytics export/dashboard actions and tests.
- Analytics deployment retention/non-essential disable policy and tests.
- Accessibility control contract and tests.
- Accessibility flow communication contract and tests.
- Accessibility assurance contract and tests.
- Operational performance target contract and tests.
- Operational resilience contract and tests.
- Operational observability and recovery contract and tests.
- Data lifecycle retention contract and tests.
- Data lifecycle governance contract and tests.
- Deployment installation contract and tests.
- Deployment readiness contract and tests.
- Phase 1 requirement-contract foundation complete through operational, data lifecycle and buyer deployment requirements.

## Test status
- M0 CI validation: passed.
- Domain primitives: CI validated.
- API application boundary: CI validated.
- Database boundary: CI validated.
- Capability gate: CI validated.
- Account lifecycle: CI validated.
- Account activation service: CI validated.
- Capability access service: CI validated.
- Entitlement lifecycle: CI validated.
- Verification lifecycle: CI validated.
- Verification access service: CI validated.
- Safety restriction policy: CI validated.
- Safety report lifecycle: CI validated.
- Moderation case lifecycle: CI validated.
- Moderation action policy: CI validated.
- Audit record domain model: CI validated.
- Analytics event taxonomy: CI validated.
- Metric definition model: CI validated.
- Metric report result model: CI validated.
- Privacy-preserving safety metric model: CI validated (CI #139).
- Analytics governance access policy: CI validated (CI #143).
- Analytics report privacy controls: CI validated (CI #147).
- Auditable analytics actions: CI validated (CI #151).
- Analytics deployment retention policy: CI validated (CI #155).
- Accessibility control contract: CI validated (CI #159).
- Accessibility flow communication contract: CI validated after targeted test typing fix (CI #165).
- Accessibility assurance contract: CI validated (CI #169).
- Operational performance target contract: CI validated (CI #173).
- Operational resilience contract: CI validated (CI #177).
- Operational observability and recovery contract: CI validated (CI #181).
- Data lifecycle retention contract: CI validated (CI #185).
- Data lifecycle governance contract: CI validated (CI #189).
- Deployment installation contract: CI validated (CI #193).
- Deployment readiness contract: CI validated (CI #197).
- Phase 1 requirement-contract foundation: complete; progress record CI validated (CI #198).

## Exact next action
1. Check CI triggered by the authentication adapter and HTTP guard commits.
2. If green: mark the authentication adapter/unauthorized boundary CI-validated.
3. Add an authorization boundary that distinguishes authenticated identity from permission/capability access and returns 403 for denied access.
4. Reuse the existing Capability Gate and Capability Access Service contracts; do not recreate authorization domain logic.
5. After authorization HTTP boundary is validated, select the next runnable account/auth requirement slice from registration, recovery, session/device management or activation.
6. Update this file after every coherent slice.

