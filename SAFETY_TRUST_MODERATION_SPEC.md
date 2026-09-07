# Safety, Trust and Moderation Specification

## Purpose
Phase 12 establishes platform-wide relationship safety, reporting, moderation and enforcement boundaries for the Universal Matching Platform.

## Existing foundations
The implementation must reuse existing:
- Account and authentication authorization boundaries.
- SafetyEnforcement persistence for account-wide restrictions.
- SafetyReport and ModerationCase persistence for durable reporting workflows.
- AuditRecord for privileged actions.
- Messaging and discovery authorization boundaries.
- Request-level rate limiting where already applied.

## Relationship Block
A relationship block is distinct from an account-wide enforcement.

A block:
- is directional: blocker -> blocked account;
- must be idempotent;
- must reject self-blocking;
- must be account-scoped and server-authorized;
- must prevent blocked accounts from appearing in discovery where policy requires;
- must prevent new direct communication in either direction;
- must not delete historical moderation evidence;
- may coexist with account-wide SafetyEnforcement.

The block domain must be platform-wide. Messaging must consume the authoritative block policy rather than maintaining a local block list.

## Reporting
Reports must reuse SafetyReport and ModerationCase.
Supported targets must be explicitly typed and validated. Message and account reporting must preserve durable target identifiers without trusting client-supplied ownership claims.

Report submission must:
- derive reporter identity from authentication;
- validate target type and target identifier;
- record a bounded reason/category;
- create or enter the moderation workflow atomically where required;
- resist duplicate/spam submission through policy and rate limits.

## Moderation
Moderation actions must remain server-authorized and auditable.
Actions may include warning, feature restriction, communication restriction, suspension and ban by reusing SafetyEnforcement semantics.

Moderation state transitions must:
- validate legal transitions;
- record actor and target;
- preserve reason category;
- retain timestamps and expiry/revocation information;
- write privileged action audit records.

## Abuse prevention
Rate limiting is an enforcement layer, not a substitute for moderation.
Phase 12 must avoid introducing provider-specific distributed infrastructure prematurely; the existing RequestRateLimiter abstraction remains the extension boundary. Distributed/shared limiting is a later scale concern unless a concrete Phase 12 acceptance requirement demands it.

## Privacy and authorization
Clients may request actions but are never authoritative for:
- reporter identity;
- moderator identity;
- account ownership;
- enforcement scope;
- block visibility;
- moderation transitions.

Blocked or restricted state must be enforced at server-side capability boundaries.

## Acceptance milestones
M12.1 Relationship block domain and persistence.
M12.2 Authoritative block policy integration into discovery and messaging.
M12.3 Report validation and target lifecycle audit.
M12.4 Moderation case/action lifecycle and audit verification.
M12.5 Abuse-prevention and rate-limit integration audit.
M12.6 End-to-end authorization and regression tests.

## Non-goals
- Do not create a messaging-local block list.
- Do not duplicate SafetyReport, ModerationCase or SafetyEnforcement tables.
- Do not add a Redis dependency solely for speculative scale.
- Do not add client-side-only safety enforcement.
