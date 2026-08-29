undefined

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
