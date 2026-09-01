CREATE TABLE "match_interactions" (
  "id" UUID NOT NULL,
  "actor_account_id" UUID NOT NULL,
  "target_account_id" UUID NOT NULL,
  "decision" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "match_interactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "match_interactions_actor_account_id_fkey" FOREIGN KEY ("actor_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
  CONSTRAINT "match_interactions_target_account_id_fkey" FOREIGN KEY ("target_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
  CONSTRAINT "match_interactions_actor_target_distinct" CHECK ("actor_account_id" <> "target_account_id")
);
CREATE UNIQUE INDEX "match_interactions_actor_account_id_idempotency_key_key" ON "match_interactions"("actor_account_id", "idempotency_key");
CREATE UNIQUE INDEX "match_interactions_actor_account_id_target_account_id_key" ON "match_interactions"("actor_account_id", "target_account_id");
CREATE INDEX "match_interactions_target_account_id_actor_account_id_idx" ON "match_interactions"("target_account_id", "actor_account_id");
