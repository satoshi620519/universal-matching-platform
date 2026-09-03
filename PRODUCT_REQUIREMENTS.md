# PRODUCT REQUIREMENTS

## Purpose
Define the product requirements for the Universal Matching Platform before major feature implementation. GitHub is the source of truth for this specification.

## Product scope
The platform is a reusable matching product for multiple business/community models, including dating, friendship, business networking, mentorship, hobby/community matching, and professional or niche matching.

## Primary buyer modes
### Quick Launch
A non-expert buyer should be able to configure branding and core business behavior without editing source code, then deploy the product using the documented launch process.

### Advanced Customization
A developer should be able to modify source code, replace matching logic, add modules, integrate external services, and create a differentiated service without rewriting the platform core.

## User roles
- Visitor: can view public/marketing surfaces where enabled.
- Member: can create and manage a profile, discover candidates, express interest, receive matches, communicate where enabled, and manage privacy/safety settings.
- Moderator: reviews reports and applies permitted moderation actions.
- Administrator: manages users, configuration, localization, matching behavior, moderation, feature visibility, and operational settings.
- Platform owner: controls deployment-level branding, enabled modules, legal/support links, and commercial configuration.

## Core functional requirements
### Authentication and accounts
- Registration and login must be supported.
- Password reset and account recovery must be supported.
- Sessions must be managed securely.
- Account deletion must be supported.
- Privacy controls must be configurable.
- Social-login architecture may be added without making a specific provider mandatory.

### Onboarding
- Onboarding must be configurable by deployment.
- Required profile questions must be configurable.
- Optional questions must be configurable.
- The platform must support progressive profile completion.
- Terminology used during onboarding must be configurable so the product is not dating-specific.

### Profiles
- Avatar and gallery/media support must be extensible.
- Biography and structured profile fields must be supported.
- Custom fields must be supported.
- Visibility/privacy of profile information must be configurable.
- Verification status must be representable without forcing a specific verification vendor.
- Profile completion progress must be available.

### Discovery
- Discovery must support configurable card, list, and grid presentations where the client UI provides them.
- Filtering and sorting must be configurable.
- Country, region, locality, language, and other supported attributes must be usable as filters where enabled.
- Precise location must not be exposed by default.

### Matching
- Users must be able to express interest in another eligible member.
- Mutual interest must be represented as a match.
- Matching rules must be configurable and replaceable.
- The architecture must support rule-based and weighted scoring approaches.
- Future recommendation/AI modules must be attachable without coupling the core domain to one algorithm.
- Duplicate actions and concurrent requests must be handled safely and idempotently.

### Messaging
- Matched members must be able to communicate where messaging is enabled by configuration.
- Conversation and message data must have clear ownership and authorization boundaries.
- Read state and typing state may be supported as scalable optional capabilities.
- Blocking and reporting must integrate with communication permissions.

### Notifications
- In-app notification architecture must be supported.
- Email and push channels must be extensible.
- Notification preferences must be configurable.
- User-facing notification text must support localization.

### Safety and moderation
- Members must be able to block another member.
- Members must be able to report users and/or supported content.
- Report categories must be configurable.
- Reports must retain sufficient context for moderation workflows while respecting privacy requirements.
- Moderators/admins must be able to warn, suspend, or ban according to permissions.
- Moderation actions must be auditable where appropriate.
- Abuse prevention, rate limiting, and spam controls are core requirements, not optional polish.

### Administration
- Administrators need operational views for users, profiles, reports, moderation, configuration, feature visibility, localization, and system health.
- Normal product administration should not require source-code changes.
- Administrative permissions must follow least privilege.

### Internationalization
- Country and region hierarchy must be supported.
- Locality/city data must be extensible.
- Languages/locales and time zones must be supported.
- User-facing terminology must be localizable.
- Matching behavior must not assume one country, language, culture, or dating model.

### Payments
- Payments/subscriptions are an optional module and must not be required by the core platform.
- Integrations must isolate provider-specific code from core matching functionality.

### Analytics
- Privacy-conscious operational metrics should cover registrations, profile completion, discovery activity, matches, conversation starts, retention events, and moderation statistics.
- Analytics must avoid requiring unnecessary personal data.

## Configuration requirements
The following must be configurable without source changes where practical:
- application name
- logo and imagery
- colors and typography/theme
- terminology
- languages/locales
- countries and regions
- profile questions and fields
- matching categories
- matching rules
- onboarding flow
- feature visibility
- legal links
- support links
- optional modules

## Non-functional requirements
### Security
- Authorization must be enforced server-side.
- Input must be validated at trust boundaries.
- Sensitive configuration must use environment/deployment secrets rather than committed credentials.
- File/media handling must be designed against abuse.
- Privacy boundaries must be explicit.

### Reliability
- Critical state transitions must be transactionally safe.
- Concurrent requests must not create inconsistent matching state.
- Failures must be observable and must not be silently converted into successful outcomes.

### Maintainability
- Core domain logic must remain modular.
- Provider-specific integrations must be isolated.
- Major behavior must have automated tests.
- Architecture and decisions must be documented before major implementation changes.

### Performance and scalability
- Database access must be designed for indexed, bounded queries.
- Real-time functionality must have a scaling path.
- Media operations must not unnecessarily block core transactions.
- Caching can be introduced where measurements justify it.

### Accessibility and UX
- The product must target accessible, responsive interfaces.
- UX must remain understandable for international users.
- Web/mobile clients should share product concepts while allowing platform-appropriate interaction patterns.

## Buyer acceptance criteria
A Quick Launch buyer should be able to:
1. Install the documented prerequisites.
2. Configure branding.
3. Select supported countries/languages.
4. Configure profile questions and matching behavior.
5. Enable/disable optional features.
6. Configure legal/support links.
7. Run the application and verify core flows.

An Advanced Customization buyer should be able to:
1. Understand the architecture from documentation.
2. Replace or extend matching logic.
3. Add modules/integrations.
4. Customize client and API behavior.
5. Run the automated test suite and validate changes.

## Out of scope for the initial core
- Mandatory dependency on a single payment provider.
- Mandatory dependency on a single social-login provider.
- Mandatory AI recommendation or moderation provider.
- Assumptions that the product is only for romantic dating.
- Requiring the original creator to operate the buyer's deployment as SaaS.

## Traceability
This specification corresponds to Phase 1 of `MASTER_DEVELOPMENT_ROADMAP.md`. Subsequent architecture, data-model, configuration, UX, and implementation work must trace back to these requirements and update the project documentation when requirements change.
