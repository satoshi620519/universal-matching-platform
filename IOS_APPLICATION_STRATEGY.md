# iOS Application Strategy

## Status
Phase 16 strategy baseline. Implementation must follow this contract before native screens are added.

## 1. Existing repository reality
The repository already contains `apps/mobile`, but it is only a TypeScript foundation and does not contain an iOS project, SwiftUI screens, React Native runtime, or Expo configuration.

The approved platform architecture selects **React Native/Expo** for mobile while preserving native-quality interaction. Therefore Phase 16 must establish the mobile runtime rather than create a second SwiftUI-only application that duplicates shared contracts and increases purchaser maintenance burden.

## 2. Platform boundary
- Mobile client: React Native with Expo-managed workflow.
- iOS is the first acceptance target for Phase 16.
- Android parity is deferred to Phase 17; platform-neutral mobile code created here should be reusable.
- Backend authorization remains server authoritative.
- Existing versioned API remains the source for durable reads and mutations.
- Existing realtime contracts remain replaceable transport boundaries.

## 3. Native-quality UX contract
iOS navigation must use platform-appropriate patterns:
- stack navigation for detail flows;
- tab navigation for primary destinations;
- modal/sheet presentation for focused tasks;
- safe-area-aware layouts;
- keyboard-aware forms;
- native accessibility labels, roles and hints;
- Dynamic Type compatibility where practical;
- reduced-motion aware transitions.

Do not port the web DOM/CSS implementation directly into mobile.

## 4. Phase 16 feature coverage
The iOS acceptance surface is:
1. authentication and session restoration;
2. account/profile loading and editing;
3. discovery with card/list presentation;
4. interest and mutual-match feedback;
5. conversation list and message thread;
6. notification presentation and unread state;
7. settings/account/privacy entry points.

Each flow must expose loading, recoverable error and empty states.

## 5. Shared-code strategy
Reuse:
- domain contracts;
- API client/types where runtime-compatible;
- configuration semantics;
- localization contracts;
- backend authorization and safety behavior.

Do not force web presentation components into native UI.

## 6. Security and persistence
- Credentials/tokens must use an OS-appropriate secure storage adapter, not plain AsyncStorage.
- Session restoration must not treat local state as authorization.
- Sensitive API responses must not be unnecessarily persisted.
- Logout clears local session state and secure credentials.

## 7. Realtime and offline posture
HTTP remains authoritative. Realtime is additive.
- reconnect through existing server contracts;
- reconcile missed state through HTTP;
- do not invent a second realtime protocol;
- Phase 16 does not claim full offline mutation support unless explicitly implemented.

## 8. Notifications boundary
Phase 11 provides notification policy and channel abstractions. Native push token registration/provider delivery requires a concrete mobile push integration and must be implemented through that existing boundary, not a parallel notification subsystem.

## 9. Implementation order
M16.1 establish Expo/React Native runtime and testable app composition.
M16.2 establish secure credential/session boundary.
M16.3 implement native navigation shell and accessibility baseline.
M16.4 connect authentication/profile flows to authoritative API.
M16.5 connect discovery/matching.
M16.6 connect conversations/realtime reconciliation.
M16.7 connect notification/settings surfaces.
M16.8 run iOS-focused acceptance audit.

## Acceptance rule
Do not mark Phase 16 complete because a generic mobile TypeScript package exists. Completion requires executable iOS-oriented application composition and the roadmap feature coverage above.

## Exact next task
Audit root workspace/tooling and existing API client contracts, then establish only the missing M16.1 Expo/React Native runtime boundary.
