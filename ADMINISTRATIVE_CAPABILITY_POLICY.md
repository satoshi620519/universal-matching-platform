# Administrative capability policy boundary

Administrative operations are authorized by explicit capabilities rather than by
scattered role-name checks.

Current policy:

- manage-administrative-roles: administrator
- review-failed-email-outbox: moderator or administrator

The policy is intentionally separate from persistence and transport. Request-time
role evaluation remains authoritative through active persisted assignments.

Role mutation composes in this order:

1. identify the actor;
2. require the administrative capability;
3. perform the lifecycle-qualified mutation;
4. append the mutation audit record.

No HTTP administration surface is introduced by this slice. The same capability
composition is the reusable boundary for privileged failed-email review/requeue.
