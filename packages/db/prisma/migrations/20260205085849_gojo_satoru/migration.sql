/*
  Warnings:

  - You are about to drop the column `import_notes` on the `events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_imported_by_fkey";

-- DropIndex
DROP INDEX "events_imported_at_idx";

-- DropIndex
DROP INDEX "events_imported_by_idx";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "import_notes",
ALTER COLUMN "imported_by" SET DATA TYPE VARCHAR(255);
