# Administrative operation integration boundary

## Current repository state

The repository contains authenticated user operations through
RequestPrincipalResolver and opaque session authentication. It does not yet
contain a persisted administrator role model, operator authorization service or
append-oriented audit persistence boundary.

Product requirements require role-based administration and auditing of sensitive
actions, but those capabilities are not implemented in the current application
slice.

## Consequence for failed email operations

Failed email outbox listing and manual requeue are available as application
services only. They must not be exposed as public administrative HTTP endpoints
until an authoritative operator boundary exists.

A future integration must:

1. authenticate the operator through the repository-owned authentication model;
2. authorize a specific administrative capability rather than infer trust from
   authentication alone;
3. record an append-oriented audit event for requeue actions;
4. preserve the target outbox message ID as correlation data without recording
   raw verification tokens or unnecessary message content;
5. retain the existing status-qualified requeue guard.

This avoids creating an unaudited privileged endpoint ahead of the project's
administration and audit foundations.
