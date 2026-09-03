# Mobile Feature Parity Matrix

This matrix defines capability parity between the existing platform services and the future iOS/Android application. It is intentionally capability-based so native UX can differ without silently dropping product functionality.

| Capability | Backend/API foundation | Mobile target | Initial priority |
|---|---|---|---|
| Authentication | Existing account services | Login, registration, session restore | P0 |
| Profile | Existing profile services | View/edit profile, completion | P0 |
| Discovery | Existing matching services | Browse, filters, actions | P0 |
| Mutual match | Existing matching services | Match state and feedback | P0 |
| Messaging | Existing messaging services | Conversations, send/read states | P0 |
| Realtime | Existing publication services | Realtime event adapter | P1 |
| Notifications | Existing notification services | In-app/push preferences | P1 |
| Block/report | Existing safety services | Safety actions from profile/message | P0 |
| Location/privacy | International/location architecture | Consent-aware configuration | P1 |
| Settings | Account/privacy services | Preferences and account controls | P1 |
| Account deletion | Existing account requirements | Deletion flow and confirmation | P0 |
| Admin/moderation | Admin application | Not a mobile end-user requirement | N/A |

## Definition of P0
A commercial mobile release must not claim feature parity until all P0 capabilities have executable screens, API integration, and automated tests.

## Sequencing rule
Implement vertical slices rather than isolated screens: a slice includes navigation, state boundary, API integration, error handling, accessibility basics, and tests.
