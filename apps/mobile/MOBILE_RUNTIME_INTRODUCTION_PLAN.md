# Mobile Runtime Introduction Plan

## Decision
Introduce the mobile runtime as an Expo application inside the existing pnpm/Turborepo workspace.

## Why this fits the repository
The repository already uses apps/* and packages/* boundaries. Expo supports monorepos managed by pnpm and recommends treating the mobile application as a workspace application. Shared domain code remains framework-independent.

## Runtime baseline
- Expo application
- React Native renderer
- TypeScript
- Expo CLI
- Expo SecureStore for production credentials

## Installation sequence
1. Generate or introduce the Expo application scaffold in apps/mobile without overwriting the existing application-layer contracts.
2. Add workspace scripts: start, android, ios, web, typecheck, test.
3. Add an environment module; no production API URL is hard-coded.
4. Add a SecureCredentialStore adapter backed by expo-secure-store.
5. Connect the existing auth/session application layer.
6. Add the first authenticated/unauthenticated shell.
7. Verify pnpm workspace dependency resolution and ensure only one React Native version is installed.

## Monorepo gate
Before merging runtime dependencies, CI must check:
- pnpm install succeeds from repository root
- mobile typecheck succeeds
- mobile tests succeed
- duplicate React/React Native versions are investigated
- Android/iOS build commands are documented

## Non-goal
Do not migrate backend, web, or domain code into React Native. The runtime consumes existing contracts rather than duplicating them.
