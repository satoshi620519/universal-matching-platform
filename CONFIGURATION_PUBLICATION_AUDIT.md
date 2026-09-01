# Configuration publication audit

Successful publication is audited through the existing AuditRecordService contract.
Configuration publication does not create actor identity or request metadata itself:
a privileged application boundary supplies the actor and optional correlation ID.

The immutable version transition remains the same database transaction. Audit is
attempted only after that transaction succeeds, so failed publication transitions
cannot emit a successful-publication audit record.

The audit event is intentionally narrow:
- area: configuration
- action: publish-configuration-version
- target: immutable configuration version ID

Draft editing is not implicitly audited by this slice; publication is the
privileged lifecycle event represented here.
