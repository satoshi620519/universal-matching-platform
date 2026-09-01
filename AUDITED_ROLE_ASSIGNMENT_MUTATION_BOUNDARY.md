# Audited administrative role mutation boundary

Role assignment mutation is an application boundary, not a public endpoint.

Each assignment requires an explicit actor identity and persists that authority in
the role assignment. Successful assignment appends a data-minimized audit record.

Revocation is status-qualified by the active role lifecycle query. An audit
record is appended only when at least one active assignment actually transitions
to revoked, avoiding audit entries that claim a mutation occurred when nothing
changed.

The mutation boundary validates effective/expiry windows before persistence.

This slice intentionally does not decide which actor is authorized to assign
which role. That policy is the next dependency and must compose request-time
role authorization with this mutation service before an HTTP surface exists.
