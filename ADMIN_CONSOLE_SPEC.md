# ADMIN CONSOLE SPEC

## Purpose
Phase 13 provides an administration boundary that allows a buyer to operate the platform without editing source code for normal administration.

## Existing backend capabilities to expose
- Moderation queue and case actions
- Account safety actions and restrictions
- Audit records
- Configuration and feature controls where canonical APIs exist
- Geographic and localization administration where implemented

## Roles and authorization
Admin operations must not rely on a generic authenticated principal. The implementation must define explicit administrative capabilities and deny access by default.

## Delivery order
1. Inventory existing admin-operable backend capabilities and authorization model.
2. Define Admin API contracts and capability boundaries.
3. Add focused backend authorization tests.
4. Implement only the smallest read/write admin slices backed by existing canonical services.
5. Build dashboard/UI after backend boundaries are stable.

## Non-goals for the first slice
- Do not duplicate moderation services.
- Do not create a second audit system.
- Do not expose unrestricted persistence CRUD.
- Do not implement speculative analytics.
