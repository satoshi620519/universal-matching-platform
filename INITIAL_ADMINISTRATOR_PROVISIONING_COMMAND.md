# Initial administrator provisioning command

The repository already uses explicit Nest application-context worker entrypoints for
operator/deployment processes. Initial administrator provisioning follows that
grounded convention rather than introducing an HTTP bootstrap route.

Run:

`pnpm --filter @universal/api administrator:provision <accountId>`

The command:

1. accepts exactly one explicit, non-empty existing Account ID;
2. creates a Nest application context without starting an HTTP listener;
3. invokes InitialAdministratorProvisioningService;
4. reports whether a new administrator assignment was created or already active;
5. closes the application context.

This is an operator/deployment command, not a runtime public API. It does not
accept caller-controlled privilege claims and does not provide self-registration
or anonymous elevation.
