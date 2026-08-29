# Database package

This package owns the database integration boundary and migration artifacts.

Migrations are intentionally kept separate from application/domain packages. Product tables will be introduced only after their domain requirements and schema decisions are recorded.

Migration configuration is defined by `packages/config/src/migrations.ts`.
