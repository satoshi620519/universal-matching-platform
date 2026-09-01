# Configuration setting definition provider

The application consumes setting definitions through a narrow provider boundary.
Controllers and persistence repositories do not own the catalog.

The initial provider is deliberately data-source neutral and can be constructed
with an authoritative definition set by deployment/application composition. An
empty provider is safe by default: unknown settings cannot become implicitly
valid.

A future product registry may replace the in-memory source without changing draft
validation callers. This slice establishes ownership and lookup semantics, not a
speculative catalog of product settings.
