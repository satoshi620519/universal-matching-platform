# ADMIN AUTHORIZATION SPEC

## Phase 13 authorization foundation

### Existing persistence capability
The canonical schema already contains Role and RoleAssignment with effective, expiry and revocation timestamps. This is the persistence foundation for administrative authorization and must be reused rather than introducing a second admin-user model.

### Current gap
RequestPrincipalResolver establishes authentication only. It does not establish administrative capability. No role-assignment service or generic admin authorization boundary is currently implemented.

### Capability-first model
Administrative endpoints must:
1. Require an authenticated principal.
2. Resolve active role assignments at request time.
3. Map active roles to explicit capabilities.
4. Deny when no required capability is granted.

### Initial capabilities
- moderation.read
- moderation.decide
- account.restrict
- audit.read
- configuration.read
- configuration.write

### Initial roles
- moderator: moderation.read, moderation.decide
- safety_admin: moderation.read, moderation.decide, account.restrict, audit.read
- platform_admin: all initial capabilities

### Explicit non-goals
- Do not trust a client-supplied role claim as the sole authorization source.
- Do not add an Account.role column.
- Do not build generic CRUD over Role/RoleAssignment.
- Do not expose admin endpoints until capability enforcement is tested.
