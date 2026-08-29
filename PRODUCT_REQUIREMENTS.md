# Product Requirements — Universal Matching Platform

## Status
Draft in progress. Phase 1 deliverable. Requirements define what the product must provide; implementation details belong in architecture documents.

## 1. Product purpose
The product shall provide a commercially distributable, globally deployable platform for multiple matching categories without redesigning the core for each category. Examples include dating, friendship, business networking, mentorship, communities, hobbies and custom categories.

## 2. Product actors
- End user
- Verified user
- Moderator
- Administrator
- Buyer/operator
- Developer/customizer

## 3. Version 1.0 scope
Web, iOS, Android, backend/API, database, admin console, buyer configuration, multiple discovery/matching methods, messaging, notifications, safety/moderation, payments, identity verification, internationalization, geographic operation, analytics foundations, and operational/customization documentation.

## 4. Account and authentication
REQ-AUTH-001 Account registration and sign-in.
REQ-AUTH-002 Secure account recovery.
REQ-AUTH-003 Configurable verification levels.
REQ-AUTH-004 Session and device management.
REQ-AUTH-005 Account deletion and privacy lifecycle controls.

## 5. Profile
REQ-PROFILE-001 Configurable profile schemas.
REQ-PROFILE-002 Operator-defined fields and visibility rules.
REQ-PROFILE-003 User-managed permitted information and media.
REQ-PROFILE-004 Category-specific extensions without redesigning core identity.
REQ-PROFILE-005 Configurable profile completion requirements.

## 6. Discovery and matching
REQ-MATCH-001 Multiple discovery/matching strategies.
REQ-MATCH-002 Operators can enable supported strategies.
REQ-MATCH-003 Mutual-interest matching.
REQ-MATCH-004 Card/swipe discovery.
REQ-MATCH-005 Search/filter discovery where enabled.
REQ-MATCH-006 Configurable rule/criteria matching.
REQ-MATCH-007 Extensible scoring/recommendation strategies.
REQ-MATCH-008 Eligibility respects geography, safety, verification and policy.

## 7. Communication baseline
REQ-COMM-001 Authorized direct messaging.
REQ-COMM-002 Message delivery state and user controls.
REQ-COMM-003 Communication moderation/reporting.
REQ-COMM-004 Category/deployment-configurable permissions.

## 8. Notification baseline
REQ-NOTIF-001 In-app notifications.
REQ-NOTIF-002 Configurable external channels.
REQ-NOTIF-003 User preferences subject to mandatory safety/operational notices.

## 9. Geography
REQ-GEO-001 Global operation.
REQ-GEO-002 Country and sub-country hierarchy.
REQ-GEO-003 Configurable service areas.
REQ-GEO-004 Geographic discovery/matching constraints.
REQ-GEO-005 Precise location privacy-controlled and non-public by default.

## 10. Internationalization
REQ-I18N-001 Multiple languages.
REQ-I18N-002 Configurable enabled languages.
REQ-I18N-003 Localized user-visible content.
REQ-I18N-004 Locale-sensitive dates, times, numbers and currencies.
REQ-I18N-005 RTL support where enabled.

## 11. Safety and moderation
REQ-SAFE-001 User blocking.
REQ-SAFE-002 User/content reporting.
REQ-SAFE-003 Moderator workflows.
REQ-SAFE-004 Configurable enforcement actions.
REQ-SAFE-005 Auditable safety-sensitive actions.
REQ-SAFE-006 Abuse prevention and rate limiting.
REQ-SAFE-007 Consistent safety effects across discovery and communication.

## 12. Identity verification
REQ-IDV-001 Multiple verification levels.
REQ-IDV-002 Configurable verification requirements.
REQ-IDV-003 Replaceable provider integration.
REQ-IDV-004 Minimized exposure of sensitive documents.
REQ-IDV-005 Verification usable by discovery, payments and safety policy.

## 13. Payments
REQ-PAY-001 Configurable commercial/payment flows.
REQ-PAY-002 One-time and recurring models.
REQ-PAY-003 Provider abstraction.
REQ-PAY-004 Auditable payment and entitlement state.
REQ-PAY-005 Configurable regional availability.

## 14. Administration
REQ-ADMIN-001 Administration console.
REQ-ADMIN-002 Role-based permissions.
REQ-ADMIN-003 User, profile, report, moderation, verification and configuration administration.
REQ-ADMIN-004 Audit sensitive actions.
REQ-ADMIN-005 Deployment configuration without ordinary source edits.

## 15. Buyer customization
REQ-CONFIG-001 Branding customization.
REQ-CONFIG-002 Languages and regions.
REQ-CONFIG-003 Profile schemas.
REQ-CONFIG-004 Discovery/matching methods.
REQ-CONFIG-005 Verification and safety policy.
REQ-CONFIG-006 Quick Launch vs Advanced Customization.

## 16. Privacy and security
REQ-SEC-001 Server-side authorization.
REQ-SEC-002 Least-privilege private-data access.
REQ-SEC-003 Auditable sensitive actions.
REQ-SEC-004 Secure secrets/credentials.
REQ-SEC-005 Abuse prevention and suspicious-activity controls.
REQ-SEC-006 Authorized realtime channels.

## 17. Non-functional requirements
REQ-NFR-001 Maintainability and modular extension.
REQ-NFR-002 Independent deployment configuration.
REQ-NFR-003 Testable and traceable requirements.
REQ-NFR-004 Production observability.
REQ-NFR-005 Scalable background processing.
REQ-NFR-006 Installation and operational documentation.

## 18. Acceptance and traceability
Each requirement shall have a unique identifier and map eventually to architecture, implementation, tests and acceptance evidence.
## 19. Detailed onboarding and account lifecycle

### Onboarding principles
Onboarding shall be configurable by deployment and category. The platform shall support progressive onboarding so non-critical information can be collected later while critical eligibility, safety, consent and verification requirements are enforced before restricted capabilities are granted.

REQ-ONBOARD-001 The system shall support configurable onboarding steps and ordering.
REQ-ONBOARD-002 Operators shall be able to mark supported onboarding steps as required, optional, or conditionally required.
REQ-ONBOARD-003 The system shall support save-and-resume for incomplete onboarding.
REQ-ONBOARD-004 The system shall explain when a user cannot continue because of an unmet required condition.
REQ-ONBOARD-005 The system shall record applicable consent and policy acknowledgements.
REQ-ONBOARD-006 The system shall support progressive profile completion after account creation.
REQ-ONBOARD-007 Onboarding rules shall support geographic, category, age/eligibility, verification and operator-policy conditions.
REQ-ONBOARD-008 The system shall distinguish account creation from activation of restricted product capabilities.
REQ-ONBOARD-009 The system shall provide safe failure and recovery paths when verification or an external provider is unavailable.
REQ-ONBOARD-010 Administrators shall be able to view operational onboarding status without exposing unnecessary sensitive information.

### Account lifecycle states
The requirements model shall support at minimum: draft/pending onboarding, active, restricted, suspended, pending deletion, deleted/anonymized where applicable. Exact state transitions will be defined in the account lifecycle specification.

## 20. Configurable category model

A category is a deployment-level product mode describing a matching use case. Categories shall configure behavior rather than fork the core application.

REQ-CATEGORY-001 The system shall support multiple categories in one deployment where enabled.
REQ-CATEGORY-002 A category shall be able to define its display name, description, localized content and branding overrides.
REQ-CATEGORY-003 A category shall be able to define its profile schema from supported field types.
REQ-CATEGORY-004 A category shall be able to define discovery and matching strategies from supported platform capabilities.
REQ-CATEGORY-005 A category shall be able to define communication eligibility.
REQ-CATEGORY-006 A category shall be able to define verification requirements.
REQ-CATEGORY-007 A category shall be able to define safety and moderation policy overrides within operator permissions.
REQ-CATEGORY-008 Category configuration shall not require duplicating core user identity records.
REQ-CATEGORY-009 The system shall support disabling a category without corrupting historical records.
REQ-CATEGORY-010 Category configuration changes shall be auditable and version-aware where changes affect active users.

## 21. Configurable profile schema

The profile system shall separate stable account identity from configurable category profile data.

REQ-PROFILE-006 Operators shall be able to create supported profile field definitions without source-code changes.
REQ-PROFILE-007 Supported field types shall include text, long text, number, date, boolean, single choice, multiple choice, controlled taxonomy reference, URL where permitted, and media reference.
REQ-PROFILE-008 Each field shall support localized label and help content.
REQ-PROFILE-009 Each field shall support validation constraints appropriate to its type.
REQ-PROFILE-010 Each field shall support visibility rules including self-only, matched users, eligible discovery users, administrators, and other supported policy scopes.
REQ-PROFILE-011 Fields shall support required, optional and conditionally required behavior.
REQ-PROFILE-012 Conditional field behavior shall be based on supported rule expressions rather than arbitrary executable code.
REQ-PROFILE-013 Operators shall be able to define field ordering and grouping.
REQ-PROFILE-014 Schema changes shall preserve historical data where compatible and provide controlled migration requirements where incompatible.
REQ-PROFILE-015 Sensitive fields shall support stricter access and retention policies.

## 22. Onboarding and category acceptance examples

Example A: Quick-launch friendship service
- Minimal registration.
- Email verification required.
- Profile completion can continue after entry.
- Search and mutual-interest matching enabled.
- Identity document verification optional.

Example B: High-trust business matching service
- Organization or professional profile fields enabled.
- Restricted discovery until required verification is complete.
- Criteria matching and search enabled.
- Communication permissions controlled by operator policy.

Example C: Custom community service
- Operator defines custom profile fields and matching criteria.
- Selected geographic service areas.
- Category-specific moderation policy.
- Branding and localization configured without source-code changes.

These examples are illustrative acceptance contexts, not restrictions on future categories.


## 23. Detailed messaging requirements
REQ-COMM-005 Conversation eligibility shall be configurable, not universally open.
REQ-COMM-006 Policies include matched-only, approved-request, open-to-eligible-users and category-specific rules.
REQ-COMM-007 Blocking, suspension and safety restrictions override ordinary eligibility.
REQ-COMM-008 Conversation policy context shall be auditable.
REQ-COMM-009 Version 1.0 supports one-to-one conversations.
REQ-COMM-010 Architecture permits future group conversations.
REQ-COMM-011 Messages have stable IDs and ordered sequences.
REQ-COMM-012 Message lifecycle and transport delivery state are distinct.
REQ-COMM-013 Sent/read states are supported where applicable.
REQ-COMM-014 Authorized text and extensible attachment references.
REQ-COMM-015 Deletion/hiding follows policy without breaking required moderation records.
REQ-COMM-016 Efficient pagination for long conversations.
REQ-COMM-017 Idempotency prevents duplicate logical messages.
REQ-COMM-018 Blocking a participant is supported.
REQ-COMM-019 Messages and conversations are reportable.
REQ-COMM-020 Moderation may restrict communication capabilities.
REQ-COMM-021 Authorized evidence/audit preservation follows minimization and retention policy.
REQ-COMM-022 Safety content processing is explicitly policy-controlled.
REQ-COMM-023 Realtime subscriptions require authentication and conversation authorization.
REQ-COMM-024 Clients reconcile missed events after disconnection.
REQ-COMM-025 Backend is authoritative for acceptance and ordering.
REQ-COMM-026 Retryable processing uses idempotency and bounded retries.
REQ-COMM-027 Persistent failures are observable and operationally handled.

## 24. Detailed notification requirements
REQ-NOTIF-004 In-app notification is first-class.
REQ-NOTIF-005 Push, email and future channels use adapters.
REQ-NOTIF-006 Stable IDs support traceability/deduplication.
REQ-NOTIF-007 Originating event type is recorded.
REQ-NOTIF-008 Policy determines eligibility, channel, priority, timing, suppression and preferences.
REQ-NOTIF-009 Non-mandatory types are operator-configurable.
REQ-NOTIF-010 Mandatory security/legal notices bypass ordinary marketing suppression.
REQ-NOTIF-011 Users manage preferences by event type/channel.
REQ-NOTIF-012 Quiet periods for non-urgent notifications.
REQ-NOTIF-013 Urgent safety/security events may bypass quiet periods by policy.
REQ-NOTIF-014 Preference changes affect future delivery predictably.
REQ-NOTIF-015 Delivery attempts are tracked separately from logical notifications.
REQ-NOTIF-016 Transient failures use bounded exponential backoff and jitter.
REQ-NOTIF-017 Idempotency/deduplication prevents duplicate user-visible notifications.
REQ-NOTIF-018 Permanent failures are not retried indefinitely.
REQ-NOTIF-019 Repeated failures become operationally observable.
REQ-NOTIF-020 Unusable device tokens/endpoints can be invalidated or replaced.
REQ-NOTIF-021 In-app history follows retention policy.
REQ-NOTIF-022 Priority distinguishes urgent safety/security, transactional and engagement events.
REQ-NOTIF-023 Lower-priority events may be batched, delayed or suppressed.
REQ-NOTIF-024 One channel failure does not prevent independently authorized fallback channels.

## Next requirements milestone
Define the payment entitlement model and identity verification levels, including configurable access rules linking entitlement and verification state to product capabilities.
