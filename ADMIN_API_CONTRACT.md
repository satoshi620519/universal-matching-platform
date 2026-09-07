# ADMIN API CONTRACT — PHASE 13 FOUNDATION

## Status
Defined from the repository's existing administrative transport, authorization and audit boundaries. This contract does not replace those foundations.

## Cross-cutting contract
All administrative endpoints must:
- resolve authentication before invoking an administrative application service;
- return 401 for missing/invalid authentication;
- enforce capability decisions server-side and return 403 for denial;
- validate identifiers and bounded vocabularies before mutation;
- keep controllers free of role lookup, persistence and direct audit writes;
- propagate an optional approved opaque correlation ID only through the existing audit boundary;
- avoid credentials, tokens, unrestricted payloads and private content in audit metadata;
- paginate collection reads.

## Existing routes retained
### Assign role
POST /administration/roles/accounts/:accountId/assign

Requires the existing role-management capability. Validates role and optional lifecycle window, then delegates to AdministrativeRoleManagementService.

### Revoke role
POST /administration/roles/accounts/:accountId/:role/revoke

Requires the existing role-management capability. A successful response requires an actual lifecycle-qualified revocation; no-op revocations must not claim mutation or create false audit records.

## Phase 13 first read-only API slice
The first admin UI should be backed by read-only endpoints in this order:

1. GET /administration/me/capabilities
   - returns the authenticated administrator's effective capabilities;
   - enables capability-driven navigation without trusting client-side role labels.

2. GET /administration/audit
   - paginated audit observations;
   - filters limited to bounded area/action/actor/target/time dimensions;
   - no raw request payload retrieval.

3. GET /administration/moderation/summary
   - aggregate queue counts and state distribution;
   - reuses Phase 12 moderation state rather than creating a second model.

4. GET /administration/system/summary
   - health-oriented aggregates only;
   - no secrets or infrastructure credentials.

## Response and pagination conventions
Collection responses should provide:
- items;
- stable cursor or explicit pagination token;
- page-size limit;
- next-page indicator/token where applicable.

Administrative errors must preserve the existing application error semantics and must not reveal authorization internals.

## UI authorization rule
The UI may hide unavailable actions for usability, but visibility is never authorization. Every API call remains independently capability-checked.

## Implementation sequence
1. Verify source-level service/repository contracts for the four read slices.
2. Add capability-checked application queries.
3. Add thin HTTP controllers.
4. Add transport tests for 401, 403, validation and success.
5. Build the first read-only admin shell against these contracts.
6. Add mutations only through existing audited application boundaries.

## Explicit anti-duplication rule
- Do not create another role evaluator.
- Do not create another audit store.
- Do not duplicate moderation transitions.
- Do not put authorization logic into the frontend.
