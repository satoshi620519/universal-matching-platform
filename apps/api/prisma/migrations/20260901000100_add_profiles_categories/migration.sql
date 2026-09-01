CREATE TABLE "categories" (
  "id" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "categories_key_key" ON "categories"("key");

CREATE TABLE "profiles" (
  "id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "category_id" UUID NOT NULL,
  "fields" JSONB NOT NULL DEFAULT '{}',
  "scope_kind" TEXT NOT NULL,
  "country_code" TEXT,
  "region_code" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "profiles_account_id_category_id_idx" ON "profiles"("account_id", "category_id");
CREATE INDEX "profiles_scope_kind_country_code_region_code_idx" ON "profiles"("scope_kind", "country_code", "region_code");
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
