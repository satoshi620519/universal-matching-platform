# TOP DESIGN HANDOFF — 2026-09-18

## CURRENT PHASE
TOP page redesign — production-quality universal matching app home

## STATUS
Paused at handoff. No claim of final completion.

## USER REQUIREMENT
Create a genuinely polished, premium, production-style TOP/home screen. The current result must not be treated as acceptable merely because CSS changed.

The product is NOT a dating-only app. It is a sellable universal matching platform/template that buyers can adapt for:
- relationships and partners
- friends and social connection
- work and hiring
- skills and services
- hobbies and communities
- local and business matching

The TOP screen must communicate this concept immediately and look like a real mobile-first matching product, not a login screen with decorative text.

## HARD CONSTRAINTS
- Change TOP/home screen only.
- Do not alter unrelated functionality, authentication logic, internal features, data processing, or other screens.
- Do not repeat CSS-only cosmetic patches.
- Inspect the real React/TSX structure before editing.
- If needed, rebuild the TOP JSX structure itself, not only the stylesheet.
- Preserve existing functionality and routes.
- Verify the actual Render deployment before claiming completion.
- Keep work documented and record the exact next action.

## LAST CONFIRMED REPOSITORY STATE
Repository: satoshi620519/universal-matching-platform
Relevant files:
- apps/web/src/landing.tsx
- apps/web/src/auth-sales.css

`landing.tsx` imports `./auth-sales.css` and contains `MiniProduct()` and `FullProductDemo()`.
The signed-out view uses `.fp-authRequired` and has a sales/home structure including:
- `.fp-homeHeader`
- `.fp-brandLockup`, `.fp-brandMark`, `.fp-liveBadge`
- `.fp-homeHero`, `.fp-heroCopy`, `.fp-kicker`
- `.fp-homeFilters`, `.fp-heroActions`, `.fp-primaryCta`
- `.fp-heroVisual`, `.fp-visualTop`, `.fp-featureCard`, `.fp-featureImage`
- `.fp-featureMeta`, `.fp-featureTags`, `.fp-floatingCard`, `.fp-miniavatar`
- `.fp-purposeStrip`, `.fp-purposeItems`
- `.fp-homeBottom`, `.fp-homeCta`

The stylesheet also contains styles intended for the signed-in app home, including `.fp-toolbar`, `.fp-filterbar`, `.fp-filter`, `.fp-profile`, `.fp-avatar`, `.fp-main`, `.fp-tags`, `.fp-score`, `.fp-actions`, and `.fp-stats`. These must be checked against the actual JSX before any further work; do not assume they are used correctly.

## LAST CONFIRMED COMMITS / DEPLOYMENT
- Last reported GitHub product commit: `5a1efc3dd61a7956fa5ed7e511563b3c94d54bf8`
- Render service: `srv-dah0j7lbedkc738j2p4g`
- Render workspace: `tea-dah0i9m1egvs73c1r0p0`
- Last confirmed Render deployment: `dep-damfr9ks728c73c18vc0`
- Last confirmed Render status: `live`
- Public URL: https://universal-matching-platform-demo.onrender.com

## KNOWN PROBLEM
The user repeatedly reported that the visual result appears unchanged or low quality. The likely cause is continuing to adjust CSS without validating the rendered DOM/actual screen structure and without creating a genuinely coherent product home experience.

## EXACT NEXT ACTION
1. Read the complete relevant sections of `apps/web/src/landing.tsx` and identify the exact TOP JSX rendered in the user's normal view and signed-out view.
2. Map every TOP element to its current CSS and identify unused/mismatched classes.
3. Design one coherent mobile-first home screen structure that clearly communicates universal matching:
   - app brand and account/notification access
   - search and location/context
   - selectable use-case categories
   - prominent real matching discovery cards
   - visible match/connection actions
   - clear progression: discover → match → connect
   - premium visual hierarchy, typography, spacing, imagery, and interaction affordances
4. Modify only the TOP JSX and its dedicated styles as necessary; do not touch unrelated functionality.
5. Deploy to Render and verify the latest commit is live.
6. Update this handoff and `DEVELOPMENT_STATUS.md` with exact files, commit, deployment, test/verification result, remaining issues, and next action.

## DO NOT DO
- Do not add more pseudo-element marketing copy as a substitute for UI structure.
- Do not claim completion from a GitHub commit alone.
- Do not start unrelated release-preparation work.
- Do not modify login/authentication behavior unless required only to preserve the TOP display.
