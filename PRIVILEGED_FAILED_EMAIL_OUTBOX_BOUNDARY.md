# Privileged failed-email outbox boundary

Failed-email review and manual requeue are privileged application operations.

Each operation composes:

1. explicit authenticated actor identity supplied by the caller boundary;
2. AdministrativeCapabilityAccessService requirement;
3. existing failed-email review/requeue transition;
4. append-only data-minimized audit persistence after successful work.

Authorization failure prevents both outbox access and audit creation.

A review audit records that the privileged review operation succeeded, not the
returned message bodies or email contents. A requeue audit is appended only when
the guarded failed-to-pending transition actually occurs.

Transport remains deferred. This boundary is intentionally reusable by the
smallest future administrative HTTP surface.
