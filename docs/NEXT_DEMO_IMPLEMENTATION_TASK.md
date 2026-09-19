# Next Demo Implementation Task

## Scope
Modify only the unauthenticated demo branch inside `apps/web/src/landing.tsx`. Preserve every NEXA landing section outside the demo.

## Required behavior
- Public visitor can enter the demo without a real account.
- Demo shell has navigation: Discover, Matches, Messages, Notifications, Profile, Safety, Global/Region, Settings.
- Category switch: Relationship, Work, Skills, Community.
- Filters visibly change the seeded discover results.
- Like/pass controls update the active profile.
- Like on a compatible seeded profile opens a match state/overlay.
- Match state provides a message composer and a visible conversation preview.
- Navigation changes the central content without leaving the demo shell.
- Global/Region view exposes country, language, and regional preference controls.
- Safety view exposes trust/safety explanations and reporting/blocking demo actions.

## Implementation constraints
- Reuse the existing internal `FullProductDemo()` and existing CSS conventions where possible.
- Do not create a second demo component or duplicate CSS.
- Do not replace `landing.tsx` from a truncated source response.
- Use the complete file available in the Codex workspace or another full-source editing environment.
- After implementation, run the web build and verify the Render deployment is `live`.
- Update `docs/WORK_LOG_2026-09-19.md` with the commit SHA, deployed revision, and verification result.

## Acceptance checks
1. Landing page outside the demo remains visually unchanged.
2. Demo opens for a guest visitor.
3. Each demo navigation item renders a distinct usable state.
4. Like/pass, match overlay, and message composer are interactive.
5. No TypeScript/build errors.
6. Render deployment is live after the change.
