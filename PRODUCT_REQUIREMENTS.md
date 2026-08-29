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


## 25. Payment products, plans and entitlement model

### Core model
Payment processing and product access shall be separated. A successful provider transaction is evidence of a commercial event; an entitlement is the independently managed authorization granting a product capability. This separation prevents application features from depending directly on a single payment provider or transaction record.

REQ-PAY-006 The system shall model products, offers/plans, purchases, payment attempts, transactions and entitlements as distinct concepts.
REQ-PAY-007 A product or plan may grant one or more capabilities for a defined period or quantity.
REQ-PAY-008 Entitlements shall be the authoritative application-level record used when checking paid access.
REQ-PAY-009 Payment-provider identifiers shall not be embedded as the only source of feature authorization.
REQ-PAY-010 Operators shall be able to configure supported products and offers without changing ordinary application feature code.

### Supported commercial models
REQ-PAY-011 Version 1.0 shall support one-time purchases.
REQ-PAY-012 Version 1.0 shall support recurring subscriptions.
REQ-PAY-013 The architecture shall support trials, promotional access, complimentary entitlements and future usage-based models.
REQ-PAY-014 A plan may have regional availability, currency and tax-related configuration boundaries.
REQ-PAY-015 An entitlement may be time-limited, renewable, revocable or quantity-limited.

### Entitlement lifecycle
REQ-PAY-016 Entitlement lifecycle shall support at minimum pending, active, scheduled-expiration, expired, revoked and suspended states.
REQ-PAY-017 Access decisions shall consider entitlement state and effective time.
REQ-PAY-018 Renewal, cancellation, refund, chargeback or provider reversal events shall be processed through explicit entitlement transition rules.
REQ-PAY-019 Administrative grants and revocations shall be audited.
REQ-PAY-020 Historical commercial events shall not be overwritten when entitlement state changes.

### Provider integration and resilience
REQ-PAY-021 Payment providers shall be implemented behind a provider abstraction.
REQ-PAY-022 External payment events shall be verified before changing commercial or entitlement state.
REQ-PAY-023 Provider callbacks shall be idempotently processed.
REQ-PAY-024 Temporary provider-processing failures shall be observable and recoverable without duplicate entitlement grants.
REQ-PAY-025 Regional or platform-specific payment constraints shall be represented as configuration rather than assumptions embedded throughout product code.

### Capability gates
REQ-PAY-026 Product capabilities may require an active entitlement, a verification level, geographic eligibility, account status or a combination of supported policy conditions.
REQ-PAY-027 Capability decisions shall be centralized and auditable.
REQ-PAY-028 Loss of an entitlement shall consistently remove only capabilities governed by that entitlement policy.
REQ-PAY-029 Operators shall be able to preview supported entitlement rules before activation where administration capabilities permit.

## 26. Identity verification levels and capability gates

### Verification principles
Verification strength shall be risk-based and use-case-specific. The platform shall not assume that every feature requires government-document verification. Identity assurance, authentication strength and feature authorization shall remain conceptually separate.

REQ-IDV-006 The system shall support configurable verification levels rather than a single universal verified/unverified flag.
REQ-IDV-007 Verification requirements may vary by category, geography, product capability and operator policy.
REQ-IDV-008 The system shall minimize collection and exposure of identity evidence.
REQ-IDV-009 Ordinary application components shall consume verification outcomes and permitted attributes rather than raw verification documents.
REQ-IDV-010 Verification providers shall be replaceable without changing core capability policy.

### Initial platform levels
The platform shall support the following abstract levels. These are product levels, not claims of equivalence to any jurisdiction's official assurance standard.

- Level 0 — Self-asserted: account exists; identity attributes have not been independently verified.
- Level 1 — Basic verified attribute: selected attributes or contact channels have been validated by an approved method.
- Level 2 — Identity verified: approved provider process establishes the configured confidence required for the deployment.
- Level 3 — Enhanced verification: additional checks or review required by high-risk capabilities or operator policy.

REQ-IDV-011 Operators shall define which supported checks satisfy each platform verification level.
REQ-IDV-012 Verification level definitions may vary by supported regional workflow while preserving a consistent application-level outcome.
REQ-IDV-013 A higher verification level shall satisfy lower-level capability requirements unless explicitly overridden by policy.
REQ-IDV-014 Verification status shall distinguish not-started, pending, additional-information-required, verified, failed, expired and revoked outcomes where applicable.
REQ-IDV-015 Verification results shall include sufficient provider and policy version metadata for audit without exposing unnecessary sensitive evidence.

### Capability linkage
REQ-IDV-016 Product capabilities may declare a minimum verification level.
REQ-IDV-017 Capability policy may combine verification requirements with entitlement, geography, account status and safety restrictions.
REQ-IDV-018 Failure, expiry or revocation of verification shall trigger policy-driven reevaluation of affected capabilities.
REQ-IDV-019 Verification completion shall not automatically expose additional personal data to other users.
REQ-IDV-020 Users shall receive understandable status and next-step information when verification blocks a requested capability.

### Manual review and exceptions
REQ-IDV-021 The system shall support provider escalation or authorized manual review where a configured workflow requires it.
REQ-IDV-022 Manual verification decisions shall record authorized actor, decision time and reason category.
REQ-IDV-023 Exception handling shall be time-bounded and auditable.
REQ-IDV-024 Operators shall not be able to silently bypass immutable audit requirements for sensitive verification decisions.

## 27. Combined access decision model

A requested capability shall be evaluated as a policy decision rather than inferred from one boolean flag.

Conceptual decision inputs may include:
- Account state.
- Safety restrictions.
- Geographic eligibility.
- Category policy.
- Required verification level.
- Active entitlement.
- Role/administrative permission.
- Feature availability for the deployment.

REQ-ACCESS-001 The backend shall make authoritative capability decisions for protected actions.
REQ-ACCESS-002 Client applications may use capability information for user experience but shall not be the final authority.
REQ-ACCESS-003 Capability denials shall support machine-readable reason categories suitable for recovery UX without exposing sensitive security logic.
REQ-ACCESS-004 Policy changes affecting access shall be auditable.
REQ-ACCESS-005 Capability evaluation shall remain modular so payment, verification and safety providers can change independently.

## Exact next requirements milestone
Define detailed moderator workflows and safety operations, then analytics/reporting requirements.


## 28. Moderator workflows and safety operations

### Report intake
REQ-MOD-001 Users shall be able to report supported users, profiles, messages and other reportable content.
REQ-MOD-002 Report intake shall collect a report reason, optional context and references to the reported subject without requiring users to expose unnecessary personal information.
REQ-MOD-003 The system shall preserve relevant report-time context according to retention policy so later content edits or deletion do not silently invalidate authorized review.
REQ-MOD-004 Duplicate or repeated reports may be linked for operational awareness without discarding independent reporter evidence.
REQ-MOD-005 The system shall provide reporters with an understandable acknowledgement and, where policy permits, status information without exposing confidential enforcement details.

### Triage and queues
REQ-MOD-006 Reports shall enter a triage workflow with configurable severity and priority signals.
REQ-MOD-007 The system shall support queues segmented by supported factors such as report type, severity, category, geography, language and assigned team.
REQ-MOD-008 Automated signals may assist prioritization but shall not be treated as an unexplained substitute for required human review policies.
REQ-MOD-009 Moderators shall only access queues and evidence authorized by their role and jurisdictional/operator scope.
REQ-MOD-010 Queue assignment, reassignment and escalation actions shall be auditable.

### Case and evidence handling
REQ-MOD-011 A moderation case shall maintain a stable identifier and lifecycle independent from individual UI sessions.
REQ-MOD-012 Authorized reviewers shall be able to review relevant evidence references, prior actions and policy context.
REQ-MOD-013 Evidence access shall follow least-privilege rules and sensitive evidence access shall be auditable.
REQ-MOD-014 The system shall distinguish original user content, derived moderation signals and reviewer notes.
REQ-MOD-015 Reviewer notes shall support restricted visibility and shall not become visible to ordinary users by default.
REQ-MOD-016 Evidence retention and deletion shall follow explicit policy rather than ad hoc moderator behavior.

### Enforcement actions
REQ-MOD-017 Supported enforcement actions shall include warning, content restriction/removal where applicable, feature restriction, communication restriction, temporary suspension and permanent account action.
REQ-MOD-018 Enforcement shall support duration, scope, reason category and effective-time metadata.
REQ-MOD-019 Safety restrictions shall propagate consistently to discovery, messaging, payments and other protected capabilities according to centralized access policy.
REQ-MOD-020 Automated enforcement, if enabled, shall have explicit thresholds, scope and review/escalation rules.
REQ-MOD-021 High-impact actions shall require the configured authorization level and audit record.
REQ-MOD-022 Enforcement reversals or modifications shall preserve the historical decision trail.

### Escalation and urgent safety operations
REQ-MOD-023 The workflow shall support escalation of urgent or high-severity cases.
REQ-MOD-024 Operators shall define emergency operational procedures outside ordinary queue ordering where required.
REQ-MOD-025 The application shall not promise emergency-response services unless a deployment explicitly provides and documents such services.
REQ-MOD-026 Safety incidents affecting platform integrity shall support linkage between multiple related reports or cases.
REQ-MOD-027 Operational handoffs shall preserve current state, responsible role and next required action.

### Appeals and review
REQ-MOD-028 Deployments may enable appeals for supported enforcement actions.
REQ-MOD-029 Appeals shall be linked to the original action while maintaining an independent review lifecycle.
REQ-MOD-030 Appeal reviewers shall receive the policy-defined evidence and history required for review.
REQ-MOD-031 Appeal outcomes shall record uphold, modify, reverse or other configured results with an audit trail.
REQ-MOD-032 The system shall support policy-defined limits on appeal eligibility and timing.

## 29. Safety consistency and abuse prevention

REQ-SAFE-008 Safety restrictions shall be enforced server-side across all relevant clients and APIs.
REQ-SAFE-009 A block shall consistently prevent policy-prohibited interaction paths, including indirect discovery or communication paths where applicable.
REQ-SAFE-010 Rate limits shall support differentiated policies by action risk and abuse signals.
REQ-SAFE-011 The system shall support configurable limits for registration, authentication attempts, messaging, discovery actions, reports and other abuse-sensitive operations.
REQ-SAFE-012 Abuse controls shall favor measurable, explainable signals and operational review over hidden permanent penalties where policy permits.
REQ-SAFE-013 Security or safety controls shall generate privacy-conscious observability rather than indiscriminate collection of user data.
REQ-SAFE-014 Repeated or coordinated abuse indicators shall support escalation to authorized operational workflows.
REQ-SAFE-015 Safety policy changes shall be versioned or otherwise traceable when they affect enforcement decisions.

## 30. Safety operations acceptance principles

The safety system shall be evaluated as an end-to-end workflow, not merely as isolated buttons.

Minimum workflow scenarios shall eventually test:
1. User blocks another user and prohibited interaction paths are consistently removed.
2. User reports a message and the report reaches an authorized moderation queue.
3. A high-severity case is escalated without waiting behind ordinary low-priority work.
4. A moderator action changes protected capabilities consistently across API and clients.
5. Evidence access is restricted and audited.
6. A reversible enforcement action can be modified while preserving history.
7. An appeal, when enabled, remains traceable to the original decision.
8. Interrupted operational work can be handed off with a clear next action.

## Exact next requirements milestone
Define analytics and reporting requirements, followed by accessibility and operational quality requirements.


## 31. Analytics and reporting requirements

### Principles
Analytics shall support product improvement, operations, commercial administration and safety effectiveness while minimizing unnecessary personal data. The analytics architecture shall separate event collection, aggregation and reporting access.

REQ-AN-001 Analytics events shall use a documented event taxonomy with stable event names and version-aware schemas.
REQ-AN-002 New analytics events shall define purpose, fields, data classification and retention expectations before production use.
REQ-AN-003 Event collection shall avoid unnecessary direct identifiers and sensitive content.
REQ-AN-004 Product analytics shall distinguish raw operational telemetry from business reporting and user-facing audit history.
REQ-AN-005 Analytics processing shall support aggregation without requiring unrestricted access to underlying user records.

### Product metrics
Version 1.0 reporting shall support configurable aggregation for:
- Account and onboarding funnel completion.
- Profile completion.
- Discovery and matching activity.
- Conversation activation and engagement at aggregate level.
- Feature adoption.
- Geographic and category-level usage where policy permits.
- Notification effectiveness at aggregate level.

REQ-AN-006 Operators shall be able to select supported reporting periods and scopes.
REQ-AN-007 Metrics shall document their calculation definition to prevent ambiguous interpretation.
REQ-AN-008 Metric definitions shall be version-aware when formulas materially change.
REQ-AN-009 Dashboards shall clearly distinguish unavailable data from zero values.
REQ-AN-010 Product analytics shall not silently repurpose sensitive verification or moderation evidence as ordinary engagement data.

### Commercial reporting
REQ-AN-011 Authorized operators shall be able to report products, purchases, subscription lifecycle and entitlement activity at appropriate aggregation levels.
REQ-AN-012 Commercial reports shall distinguish gross events from provider reversals, refunds and chargebacks where applicable.
REQ-AN-013 Revenue-related metrics shall identify calculation scope and currency/region boundaries.
REQ-AN-014 Analytics reports shall not be the authoritative financial ledger; payment-provider and accounting integrations remain distinct sources for financial reconciliation.

### Safety operations metrics
REQ-AN-015 Authorized safety operators shall be able to measure report volumes, queue age, review time, enforcement categories and appeal outcomes.
REQ-AN-016 Safety metrics shall support identification of operational bottlenecks without exposing unnecessary reporter or subject identities.
REQ-AN-017 High-level safety effectiveness metrics may be aggregated by category or region only when privacy and policy conditions permit.
REQ-AN-018 Moderation metrics shall preserve distinction between reports received, actions taken and confirmed policy violations.

### Access and governance
REQ-AN-019 Analytics access shall be role-controlled.
REQ-AN-020 Sensitive or small-cohort reports shall support suppression or aggregation controls where required.
REQ-AN-021 Export of analytics data shall be permission-controlled and auditable.
REQ-AN-022 Dashboard configuration changes that alter interpretation or visibility shall be traceable.
REQ-AN-023 Operators shall be able to configure supported retention periods and disable non-essential analytics where deployment policy requires.

## 32. Accessibility requirements

Accessibility shall be treated as a product requirement across Web, iOS and Android rather than a late visual adjustment.

REQ-A11Y-001 Interactive functionality shall support keyboard or platform-equivalent navigation where applicable.
REQ-A11Y-002 Controls shall expose accessible names, roles and states through platform accessibility APIs.
REQ-A11Y-003 User flows shall not rely solely on color, sound, motion or precise pointer gestures to convey essential information.
REQ-A11Y-004 Text and interface scaling shall be supported within reasonable product layout constraints.
REQ-A11Y-005 Focus order and focus visibility shall be predictable for supported keyboard interfaces.
REQ-A11Y-006 Dynamic status changes shall be communicated through appropriate platform mechanisms.
REQ-A11Y-007 Time-limited interactions shall provide appropriate warning, extension or alternative behavior where applicable.
REQ-A11Y-008 Media and important visual information shall support appropriate text alternatives where applicable.
REQ-A11Y-009 Accessibility preferences shall be respected when supported by the operating system or platform.
REQ-A11Y-010 Accessibility acceptance testing shall be part of major user-flow validation.

## 33. Operational quality requirements

### Performance
REQ-NFR-007 Performance targets shall be defined per critical user journey rather than as one global page-load number.
REQ-NFR-008 Critical operations shall include authentication, onboarding progression, discovery retrieval, matching actions, message sending and protected capability checks.
REQ-NFR-009 Background processing shall not unnecessarily block user-facing transactions.
REQ-NFR-010 Performance measurements shall distinguish client latency, API latency, database latency and third-party provider latency where observable.

### Availability and resilience
REQ-NFR-011 The system shall identify critical dependencies and define degraded behavior where practical.
REQ-NFR-012 Failure of optional integrations shall not unnecessarily disable unrelated core capabilities.
REQ-NFR-013 Retryable background operations shall use bounded retries and observability.
REQ-NFR-014 Production failures shall produce actionable logs, metrics or alerts appropriate to operational severity.
REQ-NFR-015 Backup and recovery requirements shall be defined before production deployment.
REQ-NFR-016 Schema and configuration changes shall have rollback or recovery procedures appropriate to their risk.

### Observability
REQ-NFR-017 The system shall provide structured logs for important backend operations.
REQ-NFR-018 Requests and asynchronous workflows shall support correlation identifiers where practical.
REQ-NFR-019 Observability shall minimize unnecessary sensitive user content.
REQ-NFR-020 Operational dashboards shall distinguish healthy, degraded and failed states.

## 34. Data retention and deletion requirements

REQ-DATA-001 Data classes shall have documented retention purposes and policies.
REQ-DATA-002 User-initiated deletion shall trigger a documented lifecycle rather than assuming immediate destruction of all related records.
REQ-DATA-003 Legal, security, fraud-prevention and safety retention exceptions shall be explicit, scoped and time-bounded where applicable.
REQ-DATA-004 Deletion workflows shall distinguish deletion, anonymization, revocation of access and archival.
REQ-DATA-005 Backups shall follow a documented expiration and recovery lifecycle.
REQ-DATA-006 Derived analytics and aggregates shall be evaluated separately for re-identification risk and retention policy.
REQ-DATA-007 Sensitive identity-verification evidence shall have stricter retention and access requirements.
REQ-DATA-008 Operators shall be able to explain supported deletion states to users without exposing internal security controls.
REQ-DATA-009 Retention policy changes shall be traceable.
REQ-DATA-010 Scheduled deletion/anonymization jobs shall be observable and failure-aware.

## 35. Buyer installation and deployment requirements

REQ-DEPLOY-001 Buyers shall receive documented supported deployment prerequisites.
REQ-DEPLOY-002 Environment-specific configuration shall be externalized from ordinary application source code.
REQ-DEPLOY-003 Secrets shall not be stored in ordinary configuration files committed to source control.
REQ-DEPLOY-004 Installation documentation shall distinguish Quick Launch configuration from Advanced Customization.
REQ-DEPLOY-005 Supported integrations shall document required credentials, callbacks and operational dependencies.
REQ-DEPLOY-006 Deployment validation shall provide a documented readiness checklist.
REQ-DEPLOY-007 Buyers shall be able to configure branding, enabled categories, languages, regions and supported policy settings through documented mechanisms.
REQ-DEPLOY-008 Upgrade documentation shall describe compatibility, migrations and rollback considerations.
REQ-DEPLOY-009 Production deployment shall include documented backup, monitoring and incident-contact responsibilities.
REQ-DEPLOY-010 Custom extensions shall have documented boundaries so buyer modifications do not unnecessarily fork core modules.

## Phase 1 requirements completion gate

Phase 1 is considered complete only when:
1. PRODUCT_REQUIREMENTS.md has been reviewed for cross-platform and multi-category consistency.
2. Every major Version 1.0 domain has uniquely identifiable requirements.
3. Architecture decisions can trace back to requirement domains.
4. Unresolved product decisions are explicitly listed rather than silently assumed.
5. The next phase can create detailed architecture and data models without redefining the product vision.
6. DEVELOPMENT_STATUS.md records the transition and exact next task.

## Exact next milestone
Perform a Phase 1 requirements consistency review, identify unresolved decisions, update DECISIONS.md where required, then transition to Phase 2 detailed architecture and data modeling.
