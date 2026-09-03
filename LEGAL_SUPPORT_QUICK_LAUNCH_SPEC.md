# Legal and Support Links Quick Launch Specification

## Purpose
Complete an explicitly declared Quick Launch configuration domain by allowing a buyer to configure public legal and support destinations without exposing protected operational controls.

## Scope
- privacy policy URL
- terms of service URL
- support URL
- optional support email

## Boundaries
- URLs are presentation/navigation metadata only.
- Quick Launch cannot alter authorization, moderation, retention, or verification policy.
- Published configuration uses the existing immutable snapshot lifecycle.
- Backward compatibility is preserved when legacy snapshots omit these fields.

## Validation
- URLs must use http or https.
- support email, when present, must be a valid normalized email address.
- Empty strings normalize to undefined.

## Next implementation gate
Map the domain onto the existing QuickLaunchDraftInput and summary projection before changing UI. Reuse the existing API draft/publish/history lifecycle and add focused legacy compatibility tests.
