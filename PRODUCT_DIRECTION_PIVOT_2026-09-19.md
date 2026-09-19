# Product Direction Pivot — 2026-09-19

## Working concept: NEXA Match OS

A white-label, international matching product built around **intent-based matching**, not a single dating or marketplace niche.

### Why this direction
- Buyers can adapt it to dating, friendship, mentoring, local services, communities, recruiting, creator collaboration, or B2B introductions.
- The product has a clear commercial hook: a buyer launches a focused matching service by configuring a use case rather than rebuilding the application.
- It is more differentiated than a generic profile-listing clone because the primary object is a **goal/request** and the system matches people to goals.

## Core experience
1. A user chooses an intent: `Meet`, `Learn`, `Work`, `Create`, `Help`, or `Join`.
2. The user creates a concise request card with goal, location/online preference, language, availability, budget/range where relevant, and safety preferences.
3. The system presents compatible people or offers using transparent match reasons.
4. Users can save, shortlist, connect, and move to moderated chat.
5. Every deployment can rename intents, fields, categories, branding, and policies.

## Product pillars
- **Intent-first:** matching starts from what the user wants to accomplish.
- **Trust-first:** report, block, consent gates, profile visibility controls, and moderation-ready workflows are first-class.
- **International by default:** locale, timezone, language, currency, distance units, and region-specific policy text are configurable.
- **White-label ready:** theme tokens, logo, copy, categories, onboarding questions, and feature flags are configurable.
- **Marketplace-ready:** one-time source-product purchase, clear installation guide, demo data, buyer checklist, and extension points.

## First build slice
- Premium landing page that explains the concept without locking the buyer into dating.
- Interactive demo entry from the landing page.
- Intent selector and request-card creation.
- Match results with explicit reasons.
- Safe connection flow and demo chat.
- Buyer-facing configuration preview showing how one codebase becomes different services.

## Explicit non-goals for the first slice
- Do not claim production-grade identity verification, payments, or legal compliance without provider integration and deployment-specific configuration.
- Do not hard-code one country, one language, or one matching niche.
- Do not discard the existing working demo until the replacement slice is verified.

## Implementation rule
Build the pivot as a coherent product experience, not as another series of cosmetic CSS overlays. Keep the current demo recoverable while the new flow is implemented and verified incrementally.
