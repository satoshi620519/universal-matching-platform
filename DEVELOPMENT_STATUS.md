# Development Status

CURRENT PHASE: Phase 3 — Implementation
CURRENT MILESTONE: Milestone 1 — Core API, database and identity
CURRENT TASK: Continue Milestone 1 runnable vertical slice using the validated Account, Authentication, Verification and Capability boundaries.
STATUS: Milestone 1 core boundary slices are CI-validated; next slice is selected from existing contracts only.

## Latest checkpoint — 2026-08-31
- Account Lookup HTTP boundary is CI-validated, including the explicit 400/404/200 contract.
- Account Activation HTTP/application boundary is CI-validated after removing the unused client-controlled currentState input.
- Provider-neutral authenticated request context and shared request-principal propagation are CI-validated.
- Authentication adapter and unauthorized 401 boundary are CI-validated.
- Capability authorization HTTP boundary and 403 authorization boundary are CI-validated.
- Verification Access HTTP/application boundary is CI-validated.
- Capability Access HTTP/application boundary is CI-validated.
- Capability Access runtime input validation is CI-validated.
- Verification Access runtime input validation is CI-validated.
- Capability Access cleanup removed a duplicate unused service/test implementation and retained the runtime-composed capabilities boundary.
- Capability Access now rejects invalid entitlementEffectiveAt and now datetime inputs at the HTTP boundary.
- Latest Capability Access validation test CI #309 passed: install, typecheck, lint, test and build all green.
- Phase 1 requirement-contract foundation remains complete; do not recreate completed requirement or architecture artifacts.

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
- Verification access application service and tests.
- Safety restriction domain policy and tests.
- Safety report lifecycle and tests.
- Moderation case lifecycle and tests.
- Moderation action policy and tests.
- Audit record domain model and tests.
- Analytics event taxonomy model and tests.
- Metric definition model and tests.
- Metric report result model and tests.
- Privacy-preserving safety metric model and tests.
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
- Account activation service/boundary: CI validated.
- Capability access service/boundary: CI validated.
- Entitlement lifecycle: CI validated.
- Verification lifecycle: CI validated.
- Verification access service/boundary: CI validated.
- Authentication/request-principal boundaries: CI validated.
- Safety/moderation/audit domain foundations: CI validated.
- Analytics, accessibility, operational quality, data lifecycle and deployment requirement foundations: CI validated.

## Exact next action
1. Use the existing validated domain/application contracts to select the next runnable Milestone 1 workflow boundary.
2. Prefer a small vertical slice with explicit input/output and tests; do not invent a new identity or persistence contract without an existing architectural basis.
3. Run the full CI workflow after the coherent slice.
4. Only after CI is green, update this status checkpoint and select the following slice.
5. Keep each slice small and preserve established domain contracts.
