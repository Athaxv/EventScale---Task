-- Step 0: Enable pgcrypto extension for digest() function
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 1: Add hash column as nullable first
ALTER TABLE "events" ADD COLUMN "hash" VARCHAR(255);

-- Step 2: Generate hashes for existing rows using a combination of fields
-- This creates a deterministic hash based on event data
UPDATE "events" 
SET "hash" = encode(digest(
    COALESCE("title", '') || '|' ||
    COALESCE("description", '') || '|' ||
    COALESCE("venue_name", '') || '|' ||
    COALESCE("venue_address", '') || '|' ||
    COALESCE("date_time_start"::text, '') || '|' ||
    COALESCE("original_url", ''),
    'sha256'::text
), 'hex')
WHERE "hash" IS NULL;

-- Step 3: Add source_event_id column as nullable
ALTER TABLE "events" ADD COLUMN "source_event_id" VARCHAR(255);

-- Step 4: Make hash NOT NULL and add unique constraint
ALTER TABLE "events" ALTER COLUMN "hash" SET NOT NULL;
CREATE UNIQUE INDEX "events_hash_key" ON "events"("hash");

-- Step 5: Add unique constraint for source_event_id and source_website combination
CREATE UNIQUE INDEX "events_source_event_id_source_website_key" ON "events"("source_event_id", "source_website");

-- Step 6: Remove old columns that are no longer needed (if they exist)
-- Note: Only uncomment if these columns exist in your database
-- ALTER TABLE "events" DROP COLUMN IF EXISTS "imported_at";
-- ALTER TABLE "events" DROP COLUMN IF EXISTS "imported_by";
-- ALTER TABLE "events" DROP COLUMN IF EXISTS "import_notes";

-- Step 7: Remove old indexes that are no longer needed (if they exist)
-- DROP INDEX IF EXISTS "events_imported_by_idx";
-- DROP INDEX IF EXISTS "events_imported_at_idx";

