# Landing Page Design Master Plan

## Purpose

This document is the source-of-truth plan for the current workstream: **top-page design only**.

The top page is not being treated as a simple marketing landing page or a decorative demo. It is the product's primary visual sales showcase. Its job is to make an overseas buyer think:

> "This is unusually well designed, the product looks substantial, and I want this system for my own service."

No child pages, application functionality, authentication, backend work, database work, or feature wiring is part of this workstream.

## Non-negotiable scope boundary

### Current phase: TOP PAGE DESIGN ONLY

Allowed:
- visual redesign of the top page
- copy hierarchy needed to communicate product value
- product-UI showcase concepts rendered as front-end design
- responsive visual design
- visual interaction states and restrained motion
- premium brand/art direction
- visual storytelling of the platform's capabilities

Not allowed yet:
- implementing real matching behavior
- authentication
- real navigation destinations
- database integration
- API integration
- child-page implementation
- production feature wiring
- changing backend/domain behavior

The later order is:

1. Finish and freeze top-page design.
2. Design child pages.
3. Implement functionality.
4. Connect the implemented functionality to the designed pages.

## Design objective

The page must communicate five things in sequence:

1. **Different** — this does not look like another generic matching app.
2. **Desirable** — the visual system is premium enough that the buyer wants the product.
3. **Substantial** — the page visibly demonstrates a broad, serious product surface.
4. **Adaptable** — the buyer can imagine applying the system to dating, friendship, networking, communities, services, or a niche use case.
5. **Buyable** — the visitor understands that this is a reusable system foundation, not merely a concept or consumer app.

## Differentiation direction

Avoid the visual language commonly associated with generic matching apps:
- heart-heavy romantic decoration
- pink/purple gradient defaults
- stock-photo dating scenes
- repetitive swipe-card compositions
- generic three-icon feature grids
- generic AI/SaaS dashboard hero patterns
- template-like bento grids without product meaning

Preferred direction:
- editorial luxury
- premium product design
- restrained technology aesthetic
- strong typography
- asymmetric composition
- generous negative space
- carefully staged product UI
- human connection represented through relationships, signals, context, and information rather than romantic clichés
- global perspective
- subtle motion that demonstrates product behavior rather than decoration

## Product-led storytelling

The page should progressively reveal the product instead of only describing it.

Target narrative:

### 01 — Identity
Establish MONO as a distinctive universal matching platform.

### 02 — The matching experience
Show a visually compelling matching interface and explain why a connection is being surfaced.

### 03 — Discovery
Show that discovery is richer than a simple swipe card: purpose, interests, location, compatibility, and context can coexist.

### 04 — Connection
Show the transition from match to conversation/relationship without implementing the real feature yet.

### 05 — Trust and safety
Visually communicate privacy, reporting, blocking, moderation, and trust-oriented product decisions.

### 06 — Global / regional adaptability
Show that the platform can be shaped for different countries, regions, languages, and local use cases.

### 07 — Business/admin power
Show product surfaces that imply serious system depth: administration, moderation, analytics, configuration, and operational control.

### 08 — Customization
Show the buyer that the same foundation can become a distinct branded service.

### 09 — Final desire
End with a strong visual and copy statement that makes the buyer want to own/build on the system.

## Visual product surfaces to design into the top page

These are **visual demonstrations only in this phase**. They do not imply that the underlying functionality is being implemented now.

Candidate showcase surfaces:
- profile / identity card
- compatibility / match reasoning
- discovery
- location / regional context
- interests and goals
- connection state
- conversation preview
- safety / trust state
- moderation/admin preview
- analytics preview
- configuration / branding preview
- multi-device representation

Only the strongest surfaces should be shown. The page must avoid becoming a feature catalog.

## Quality bar

A change is justified only if it improves at least one of:
- differentiation
- product comprehension
- perceived product depth
- buyer desire
- trust
- international appeal
- visual memorability

Do not make cosmetic changes merely to create progress.

## Anti-AI-template rule

The page must not look like an automatically assembled landing-page template. Avoid:
- predictable repeated card layouts
- excessive gradients/glows
- generic floating UI cards
- meaningless decorative data
- overuse of animation
- vague claims unsupported by product visuals
- excessive font weights
- visual effects that compete with the product

## Responsive rule

Desktop is not allowed to be the only finished composition. Every major visual story must have a deliberate mobile composition rather than a simple stacked desktop layout.

## Completion criteria for this workstream

The top page is considered design-complete only when:

- a first-time visitor can understand the product category quickly
- the page clearly feels unlike a generic matching-app landing page
- the page makes the underlying system feel substantial
- product UI is used as evidence of capability, not decoration
- the universal/customizable nature is understandable
- the premium visual identity remains coherent from hero through footer
- desktop/tablet/mobile hierarchy is deliberate
- motion and interaction states support the product story
- no known concrete design defect remains
- the design state and exact next step are recorded in GitHub

## Progress log

### Checkpoint 2026-09-10 — First product-led redesign implemented

Status: **IN PROGRESS — TOP PAGE DESIGN ONLY**

Exact commit: `0839bea2ddac6dc07e49406e64e127a86028c1f2`

Changes made:
- preserved the existing MONO premium identity rather than restarting the design
- added a dedicated product-led showcase visual system in `apps/web/src/landing-showcase.css`
- changed the top-page narrative from mostly abstract marketing copy to staged product storytelling
- added visual-only matching reasoning UI with compatibility, goals, interests, and location context
- added visual-only discovery UI showing different use-case signals
- added visual-only trust/safety product surface
- added visual-only admin/operations surface with metrics and activity visualization
- added visual-only Quick Launch / brand customization surface
- kept all showcase surfaces front-end visual concepts only; no real feature behavior, API, database, authentication, or child pages were implemented
- added responsive layouts for the new showcase sections

Verification:
- GitHub source updated successfully.
- Render automatically started a new deployment for commit `0839bea2ddac6dc07e49406e64e127a86028c1f2` because the linked service auto-deploys from `main`.
- Latest Render inspection at this checkpoint reports deploy `dep-dah1je21qmas73c61fsg` as `build_in_progress`; therefore the new version is **not yet verified live**.
- No visual browser verification is claimed.

Known remaining work:
- verify the new Render deployment reaches `live`
- audit the resulting composition for concrete design defects
- continue refining only where differentiation, product comprehension, buyer desire, trust, or international appeal improves
- complete the final top-page design freeze only after those checks

Single next action:
**Recheck deploy `dep-dah1je21qmas73c61fsg`; if live, audit the new composition and record the next concrete design improvement instead of repeating completed work.**

### Checkpoint 2026-09-10 — Direction reset for commercial visual objective

Status: **IN PROGRESS — TOP PAGE DESIGN ONLY**

Reason for reset: the previous checkpoint correctly froze a polished visual landing page, but the new explicit requirement is stronger: the top page must function as a high-end product showcase intended to create purchase desire, not merely present a beautiful matching-app aesthetic.

Verified current source before this reset:
- `apps/web/src/landing.tsx`
- `apps/web/src/landing.css`
- `apps/web/src/landing-polish.css`
- `LANDING_DESIGN_STATUS.md`

Existing work is preserved as the baseline. No duplicate implementation is authorized.

Next exact work:
1. Audit the current top-page composition against this master plan.
2. Replace only the sections that are too generic or too abstract.
3. Introduce distinctive product-led visual storytelling while preserving the premium MONO identity.
4. Verify the design build/deployment path.
5. Record the exact resulting commit, design changes, remaining defects, and next step.

## Handoff rule

At every meaningful stopping point, update this document with:
- current status
- exact commit
- what changed
- what was verified
- what remains
- the single next action

Never use the chat conversation as the sole source of continuation state.
