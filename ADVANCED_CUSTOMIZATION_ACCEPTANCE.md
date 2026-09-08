# Advanced Customization Acceptance

## Purpose

This is a reproducible Phase 27 buyer-facing acceptance walkthrough. It intentionally uses an existing supported extension boundary rather than introducing a second plugin system.

## Selected extension path

Use the existing domain match-strategy contract.

Repository evidence includes:

- packages/domain/src/match-strategy.ts
- packages/domain/src/rule-based-match-strategy.ts
- packages/domain/src/match-strategy-selection.ts
- focused tests alongside those contracts

## Acceptance procedure

1. Start from the supported strategy contract rather than repository/database access.
2. Implement a replacement strategy that satisfies the existing contract.
3. Select/register it through the existing strategy-selection boundary.
4. Verify behavior with a focused strategy test.
5. Run the standard repository gates before distribution:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Expected result

The customization changes matching behavior through a supported domain strategy while leaving authorization, persistence, and unrelated infrastructure unchanged.

## Failure rule

Do not bypass the strategy boundary by directly mutating repositories. Do not expose secrets or internal persistence models as extension data. A failing replacement must be fixed through its focused contract rather than weakening the platform's release gates.

## Evidence boundary

This document defines a reproducible acceptance path. Final marketplace-release evidence still requires execution against the selected release-candidate commit.
