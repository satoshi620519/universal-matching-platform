# Append-oriented audit persistence boundary

Audit records are immutable operational observations. The persistence boundary
exposes append only; it intentionally provides no update or delete operation.

Stored fields are minimized to:

- actor account identifier;
- bounded area and action classification;
- optional stable target identifier;
- optional correlation identifier;
- occurrence timestamp.

Raw verification tokens, credentials, message bodies and unrestricted request
payloads are not accepted by this contract.

The repository indexes actor/time, action/time and target/time retrieval paths.
Audit persistence is a dependency for future role assignment mutation and
privileged operations, but no public administrative endpoint is introduced by
this slice.
