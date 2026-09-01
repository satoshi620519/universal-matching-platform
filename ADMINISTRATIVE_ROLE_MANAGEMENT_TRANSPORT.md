# Administrative role management HTTP transport

Bootstrap provisioning is intentionally not exposed here.

Routes:

- POST /administration/roles/accounts/:accountId/assign
- POST /administration/roles/accounts/:accountId/:role/revoke

Transport composition:

1. validate account identifier, role vocabulary and optional ISO timestamps;
2. resolve the authenticated request principal using the repository convention;
3. forward only principal identity and validated input to AdministrativeRoleManagementService.

The controller performs no role lookup, capability decision, persistence operation or
audit write. AdministrativeRoleManagementService remains responsible for
authorization-before-mutation and the mutation boundary remains responsible for
lifecycle-qualified persistence and successful-operation audit records.

Invalid role vocabulary and invalid effective/expiry windows are rejected before
privileged mutation. Bootstrap remains a separate deployment/operator boundary.
