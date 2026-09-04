# NOTIFICATION SYSTEM SPEC

## Scope
Phase 11 standardizes notification delivery without coupling domain events to a single transport.

## Notification lifecycle
domain event -> policy/preference evaluation -> durable notification -> optional channel dispatch.

Persistence is authoritative. Channel delivery failures must not erase the durable event.

## Channels
- in-app: required core channel
- email: replaceable adapter boundary
- push: replaceable adapter boundary

## Authorization and privacy
- recipients are server-derived from domain events
- notification payloads contain only data appropriate for the recipient
- channel dispatch never bypasses account state, safety restrictions, or preferences

## Preferences
Preferences are normalized by event category and channel. Defaults are explicit and deployment-configurable.

**Current safe defaults:** in-app is enabled by default; email and push require explicit policy enablement. Categories are match, message, account_security, and moderation. A future account-level preference store may override deployment defaults without changing event producers.

## Initial event categories
- match
- message
- account/security
- moderation

## Localization
Human-readable content is rendered at delivery using recipient locale. Durable event payloads store stable event identifiers/data, not one permanently localized sentence. Existing LocalizationConfiguration remains the deployment authority for supported/default locales; notification delivery must not invent a second locale configuration.

## Reliability
- idempotent event identifiers
- retryable channel adapters
- durable read/unread state
- reconnect reconciliation for in-app delivery
- no duplicate domain notification caused by channel retry

## Phase 11 acceptance criteria
- durable in-app notifications
- read state
- preference evaluation
- email adapter contract
- push adapter contract
- localization boundary
- security/moderation/account event support
- idempotency and retry boundaries
