# Administrative authorization read boundary

Administrative privilege is evaluated from persisted role assignments, not from
request payloads or authentication alone.

The request-time read path is:

Request principal accountId
  -> RoleAssignmentRepository.findActiveForAccount(accountId, now)
  -> effective/revocation/expiry filtering in persistence
  -> AdministrativeRoleAccessService
  -> explicit role or multi-role capability decision

Authentication establishes identity only. It does not imply administrator,
moderator or auditor privilege.

This slice intentionally implements read-time authorization inputs only. Role
assignment mutation and privileged HTTP endpoints remain deferred until
append-oriented audit persistence exists, so privilege changes and privileged
actions can be recorded coherently.
