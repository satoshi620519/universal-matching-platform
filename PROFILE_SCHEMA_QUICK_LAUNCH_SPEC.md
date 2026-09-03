# Profile Schema Quick Launch Integration

## Purpose
Expose the existing versioned ProfileSchemaConfiguration through the purchaser-facing Quick Launch workflow without changing ownership of actual profile values.

## Boundaries
- Configuration owns allowed field metadata only.
- Profile.fields remains the sole owner of submitted user values.
- ProfileProjectionPolicy remains the runtime owner of visibility behavior.
- Published snapshots freeze schema definitions/options and never embed profile values.
- Existing Quick Launch draft/publish/history lifecycle is reused.

## Purchaser controls
Inside Quick Launch, a buyer can define field key, label, type, required state, visibility, and options for select fields.

## Validation
- Stable snake_case keys.
- Unique keys.
- Non-empty labels.
- Select fields require unique options.
- Non-select fields cannot carry options.

## Summary
Review, Published, and History views expose compact field counts, required counts, and field keys. Detailed schema definitions remain recoverable from the immutable snapshot.
