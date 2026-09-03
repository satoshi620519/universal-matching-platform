# Mobile Runtime Bootstrap Checklist

## Preflight
Before generating Expo files, verify from repository root:
- pnpm workspace includes apps/mobile
- root install succeeds
- mobile package has explicit dependencies only
- no duplicate react-native dependency chain is introduced

## Bootstrap target
Create the Expo application runtime while preserving:
- src/index.ts application contracts
- src/auth.ts authentication logic
- existing Vitest tests

## Required runtime files
- package.json with Expo scripts
- app.json
- App.tsx
- babel configuration only if required by the selected SDK
- environment example
- secure storage adapter

## Verification
Run after dependency installation:
1. pnpm install
2. pnpm --filter <mobile-package> typecheck
3. pnpm --filter <mobile-package> test
4. pnpm --filter <mobile-package> start
5. pnpm why --depth=10 react-native

## App shell acceptance criteria
The first shell must distinguish:
- restoring session
- unauthenticated
- authenticated

It must not expose a credential value in UI, logs, or error messages.

## Build boundary
Native iOS/Android project generation is deferred until the JavaScript runtime, dependency graph, and application shell pass verification.
