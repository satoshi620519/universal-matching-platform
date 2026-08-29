# Product Requirements — Universal Matching Platform

## Status
Draft in progress. Phase 1 deliverable. Requirements describe what the product must provide; implementation details belong in architecture documents.

## 1. Product purpose
The product shall provide a commercially distributable, globally deployable platform for building matching services across multiple categories without requiring the core product to be redesigned for each category.

Supported examples include dating, friendship, business networking, mentorship, communities, hobbies, and custom categories.

## 2. Product actors
- End user: creates an account, profile and participates in discovery, matching and communication.
- Verified user: end user with one or more completed verification levels.
- Moderator: handles safety queues and moderation actions within assigned permissions.
- Administrator: manages platform and operational settings.
- Buyer/operator: deploys and configures a branded instance.
- Developer/customizer: performs advanced source-level extensions.

## 3. Version 1.0 product scope
Version 1.0 shall include:
- Web application.
- iOS application.
- Android application.
- Backend API and background processing.
- Primary database.
- Administration console.
- Buyer configuration system.
- Discovery and multiple matching methods.
- Messaging and notifications.
- Safety, reporting, blocking and moderation.
- Payments.
- Identity verification integration.
- Internationalization and localization.
- Geographic and region-aware operation.
- Analytics foundations.
- Installation, deployment, administration and customization documentation.

## 4. Account and authentication requirements
REQ-AUTH-001 The system shall support account registration and sign-in.
REQ-AUTH-002 The system shall support secure account recovery.
REQ-AUTH-003 The system shall support configurable verification levels.
REQ-AUTH-004 The system shall support session and device management.
REQ-AUTH-005 The system shall support account deletion and privacy-related lifecycle controls subject to operator policy and applicable requirements.

## 5. Profile requirements
REQ-PROFILE-001 The system shall support configurable profile schemas.
REQ-PROFILE-002 Operators shall be able to define profile fields and field visibility rules.
REQ-PROFILE-003 Users shall be able to manage permitted profile information and media.
REQ-PROFILE-004 The system shall support category-specific profile extensions without redesigning the core identity model.
REQ-PROFILE-005 The system shall support configurable profile completion requirements.

## 6. Discovery and matching requirements
REQ-MATCH-001 The system shall support multiple discovery and matching strategies.
REQ-MATCH-002 Operators shall be able to enable or disable supported strategies.
REQ-MATCH-003 The initial product shall support mutual-interest matching.
REQ-MATCH-004 The initial product shall support card/swipe-style discovery.
REQ-MATCH-005 The initial product shall support searchable/filterable discovery where enabled.
REQ-MATCH-006 The system shall support configurable rule or criteria matching.
REQ-MATCH-007 The architecture shall permit scoring and recommendation strategies to be added without replacing the matching core.
REQ-MATCH-008 Matching eligibility shall respect configured geography, safety restrictions, verification rules and operator policy.

## 7. Communication requirements
REQ-COMM-001 The system shall support authorized direct messaging where permitted by matching and safety policy.
REQ-COMM-002 The system shall support message delivery state and appropriate user controls.
REQ-COMM-003 The system shall support moderation and reporting of communication content.
REQ-COMM-004 Communication permissions shall be configurable by category and deployment policy.

## 8. Notifications requirements
REQ-NOTIF-001 The system shall support in-app notifications.
REQ-NOTIF-002 The system shall support configurable external notification channels.
REQ-NOTIF-003 Users shall be able to manage notification preferences subject to mandatory safety or operational notices.

## 9. Geographic requirements
REQ-GEO-001 The system shall support global operation.
REQ-GEO-002 The system shall support country and sub-country geographic hierarchy.
REQ-GEO-003 Operators shall be able to define supported service areas.
REQ-GEO-004 Matching and discovery shall support configurable geographic constraints.
REQ-GEO-005 Precise location shall be privacy-controlled and shall not be public by default.

## 10. Internationalization requirements
REQ-I18N-001 The system shall support multiple languages.
REQ-I18N-002 Operators shall be able to configure enabled languages.
REQ-I18N-003 User-visible product content shall support localization.
REQ-I18N-004 The architecture shall support locale-sensitive formatting for dates, times, numbers and currencies.
REQ-I18N-005 The product shall support right-to-left languages where enabled.

## 11. Safety and moderation requirements
REQ-SAFE-001 Users shall be able to block other users.
REQ-SAFE-002 Users shall be able to report users and supported content.
REQ-SAFE-003 The system shall provide moderation workflows for authorized staff.
REQ-SAFE-004 The system shall support configurable enforcement actions.
REQ-SAFE-005 Safety-sensitive actions shall be auditable.
REQ-SAFE-006 The product shall include abuse-prevention and rate-limiting capabilities.
REQ-SAFE-007 Safety restrictions shall affect discovery and communication consistently.

## 12. Identity verification requirements
REQ-IDV-001 The system shall support multiple verification levels.
REQ-IDV-002 Operators shall be able to configure when verification is required.
REQ-IDV-003 The identity verification integration shall be replaceable by provider.
REQ-IDV-004 Verification results shall be represented without unnecessarily exposing sensitive verification documents to ordinary application components.
REQ-IDV-005 Verification status shall be usable by discovery, payments and safety policy where configured.

## 13. Payment requirements
REQ-PAY-001 The system shall support configurable commercial/payment flows.
REQ-PAY-002 The initial product architecture shall support recurring and one-time payment models.
REQ-PAY-003 Payment providers shall be abstracted to avoid core dependence on one provider.
REQ-PAY-004 Payment status and entitlement state shall be auditable.
REQ-PAY-005 Regional payment availability shall be configurable.

## 14. Administration requirements
REQ-ADMIN-001 The system shall provide an administration console.
REQ-ADMIN-002 Administrators shall have role-based permissions.
REQ-ADMIN-003 Administration shall cover users, profiles, reports, moderation, verification status, configuration and operational settings.
REQ-ADMIN-004 Sensitive administrative actions shall be audited.
REQ-ADMIN-005 Administration shall support deployment-level configuration without ordinary source-code changes.

## 15. Buyer customization requirements
REQ-CONFIG-001 Buyers shall be able to customize branding.
REQ-CONFIG-002 Buyers shall be able to configure supported languages and regions.
REQ-CONFIG-003 Buyers shall be able to configure profile schemas.
REQ-CONFIG-004 Buyers shall be able to configure enabled discovery and matching methods.
REQ-CONFIG-005 Buyers shall be able to configure verification and safety policies within supported capabilities.
REQ-CONFIG-006 The product shall distinguish Quick Launch configuration from Advanced Customization.

## 16. Privacy and security requirements
REQ-SEC-001 Authorization shall be enforced server-side.
REQ-SEC-002 Access to private user data shall follow least-privilege principles.
REQ-SEC-003 Sensitive operational actions shall be auditable.
REQ-SEC-004 The product shall support secure handling of secrets and credentials.
REQ-SEC-005 The product shall support abuse prevention, rate limiting and suspicious activity controls.
REQ-SEC-006 Realtime communication channels shall require authorization.

## 17. Non-functional requirements
REQ-NFR-001 The product shall be designed for maintainability and modular extension.
REQ-NFR-002 The product shall support independent deployment configuration.
REQ-NFR-003 The product shall provide testable and traceable requirements.
REQ-NFR-004 The product shall provide observability foundations for production operation.
REQ-NFR-005 The product shall support scalable background processing.
REQ-NFR-006 The product shall provide installation and operational documentation for buyers.

## 18. Acceptance and traceability
Each requirement shall have a unique identifier and shall eventually map to architecture, implementation, tests, and acceptance evidence.

## Open requirement work
The following sections still require detailed requirements before this document is finalized:
1. Detailed onboarding and account flows.
2. Profile schema and category model.
3. Complete messaging behavior.
4. Notification matrix.
5. Payment entitlement and marketplace policy.
6. Identity verification level definitions.
7. Full moderator workflows.
8. Analytics and reporting requirements.
9. Accessibility requirements.
10. Performance and availability targets.
11. Data retention and deletion policy.
12. Detailed buyer installation and deployment requirements.

## Exact next action
Expand the open requirement sections, beginning with onboarding/account flows and the configurable category/profile model. Update DEVELOPMENT_STATUS.md after this milestone.
