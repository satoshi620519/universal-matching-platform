# Mobile application

Expo runtime bootstrap for iOS and Android.

## Planned commands

After Expo dependencies are installed from the workspace root:

- `pnpm --filter mobile start`
- `pnpm --filter mobile android`
- `pnpm --filter mobile ios`
- `pnpm --filter mobile test`
- `pnpm --filter mobile typecheck`

The application layer remains in `src/` and is intentionally independent from the React Native UI layer.

## Monorepo note

Dependency installation and duplicate React Native checks must be performed from the repository root.
