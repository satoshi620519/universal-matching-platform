# Configuration draft validation

Draft values are validated against explicit setting definitions before they become
persistence inputs. A definition owns the setting key, primitive type and allowed
scopes. Validation rejects mismatched keys, declared types, disallowed scopes and
runtime values incompatible with the declared primitive type.

This is intentionally a domain boundary. Persistence CHECK constraints still
protect physical typed columns, while draft validation protects product-level
meaning. Publication remains a separate immutable lifecycle transition.

A future registry/application layer must supply authoritative setting definitions;
this slice does not hard-code an application-specific catalog.
