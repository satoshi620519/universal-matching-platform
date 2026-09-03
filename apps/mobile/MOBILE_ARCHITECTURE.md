# Mobile Application Strategy

## Current state
The mobile workspace is intentionally a TypeScript foundation and does not yet declare a native runtime. This prevents the repository from claiming iOS/Android support before an executable application architecture exists.

## Target
The mobile product must provide equivalent core user capabilities on iOS and Android while reusing domain contracts and backend APIs.

## Recommended implementation direction
Use a single cross-platform React Native application with Expo as the deployment/tooling layer, while keeping platform-specific adapters isolated.

### Architecture
- presentation: screens, navigation, accessibility
- application: feature use cases and state orchestration
- infrastructure: API client, secure storage, push adapters
- shared contracts: packages/domain and API DTOs
- platform adapters: iOS/Android capabilities behind interfaces

## Initial feature slices
1. Authentication and session restoration
2. Onboarding and configurable profile completion
3. Discovery and matching actions
4. Conversations and realtime updates
5. Notifications and preferences
6. Safety actions: block and report
7. Settings and account deletion/privacy

## Non-negotiable constraints
- No precise location exposure by default
- Secure token storage; never plain-text persistence
- Deep links and push payloads must be validated
- Feature parity is measured by user capability, not identical UI
- Native dependencies must be introduced with reproducible setup documentation

## Next implementation gate
Before adding React Native dependencies, create and approve the mobile application contract: navigation boundaries, session storage abstraction, API environment configuration, and feature parity matrix. This avoids installing a framework before the product architecture is defined.
