# Initial administrator provisioning boundary

Administrative role management cannot bootstrap itself: an endpoint protected by
the administrator role cannot create the first administrator.

The first administrator is therefore intentionally outside ordinary HTTP role
mutation. Provisioning is an explicit deployment-time operation that requires:

1. a pre-existing Account identifier supplied directly to a privileged operator;
2. an explicit one-shot provisioning command/service boundary;
3. no unauthenticated HTTP bootstrap route;
4. no self-registration or caller-controlled elevation path;
5. idempotent handling of an already active administrator assignment;
6. an audit strategy that does not invent a fake human actor identity.

The ordinary AdministrativeRoleManagementService remains the only path for
runtime role changes. Initial provisioning must not use that service because it
requires the capability being established.

The next implementation slice should add a dedicated operator-invoked bootstrap
command with explicit account input and idempotent assignment semantics, while
keeping it out of the public HTTP application surface.
