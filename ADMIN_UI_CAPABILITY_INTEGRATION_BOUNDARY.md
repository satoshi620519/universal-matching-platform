# Admin UI capability integration boundary

The existing admin application is currently a Quick Launch workflow. The existing moderation console has a separate entrypoint and should not be recreated.

Phase 13 capability discovery is now available through:
- API: GET /administration/me/capabilities
- Browser adapter: createBrowserAdministrativeCapabilitiesApi()

The next UI change must introduce a top-level administrative workspace/navigation boundary rather than inserting permission checks into individual Quick Launch form controls.

Initial navigation targets should be capability-gated:
- Quick Launch: manage-quick-launch
- Moderation: manage-moderation
- Administrative roles: manage-administrative-roles
- Failed email outbox: review-failed-email-outbox

Server-side authorization remains authoritative. Client gating is only for navigation and usability.

No UI implementation is added in this commit because main.tsx is a single-purpose Quick Launch shell and converting it safely requires extracting the current workflow before adding navigation. This is the exact next implementation step, not a reason to duplicate the existing console.
