-- CreateEnum
CREATE TYPE "provider" AS ENUM ('google', 'email');

-- CreateEnum
CREATE TYPE "event_status" AS ENUM ('new', 'updated', 'inactive', 'imported');

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(500),
    "provider" "provider" NOT NULL DEFAULT 'email',
    "provider_id" VARCHAR(255),
    "password" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "summary" VARCHAR(500) NOT NULL,
    "venue_name" VARCHAR(255) NOT NULL,
    "venue_address" VARCHAR(500) NOT NULL,
    "city" VARCHAR(100) NOT NULL DEFAULT 'Sydney',
    "category" VARCHAR(100) NOT NULL,
    "date_time_start" TIMESTAMPTZ(6) NOT NULL,
    "date_time_end" TIMESTAMPTZ(6) NOT NULL,
    "date_time_timezone" VARCHAR(100) NOT NULL DEFAULT 'Australia/Sydney',
    "image_url" VARCHAR(500),
    "poster_url" VARCHAR(500),
    "source_website" VARCHAR(100) NOT NULL,
    "source_event_id" VARCHAR(255),
    "original_url" VARCHAR(500) NOT NULL,
    "last_scraped_at" TIMESTAMPTZ(6),
    "status" "event_status" NOT NULL DEFAULT 'new',
    "hash" VARCHAR(255) NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "imported_at" TIMESTAMPTZ(6),
    "imported_by" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_leads" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "event_id" UUID NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "redirected_at" TIMESTAMPTZ(6),
    "original_event_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "event_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_email_idx" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_provider_idx" ON "admins"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "events_original_url_key" ON "events"("original_url");

-- CreateIndex
CREATE UNIQUE INDEX "events_hash_key" ON "events"("hash");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_city_idx" ON "events"("city");

-- CreateIndex
CREATE INDEX "events_is_approved_idx" ON "events"("is_approved");

-- CreateIndex
CREATE INDEX "events_last_scraped_at_idx" ON "events"("last_scraped_at");

-- CreateIndex
CREATE INDEX "events_source_website_idx" ON "events"("source_website");

-- CreateIndex
CREATE INDEX "events_original_url_idx" ON "events"("original_url");

-- CreateIndex
CREATE INDEX "events_date_time_start_idx" ON "events"("date_time_start");

-- CreateIndex
CREATE INDEX "events_is_approved_status_idx" ON "events"("is_approved", "status");

-- CreateIndex
CREATE INDEX "events_city_is_approved_status_idx" ON "events"("city", "is_approved", "status");

-- CreateIndex
CREATE INDEX "events_source_website_last_scraped_at_idx" ON "events"("source_website", "last_scraped_at");

-- CreateIndex
CREATE UNIQUE INDEX "events_source_event_id_source_website_key" ON "events"("source_event_id", "source_website");

-- CreateIndex
CREATE INDEX "event_leads_email_idx" ON "event_leads"("email");

-- CreateIndex
CREATE INDEX "event_leads_event_id_idx" ON "event_leads"("event_id");

-- CreateIndex
CREATE INDEX "event_leads_consent_idx" ON "event_leads"("consent");

-- CreateIndex
CREATE INDEX "event_leads_created_at_idx" ON "event_leads"("created_at");

-- CreateIndex
CREATE INDEX "event_leads_event_id_email_idx" ON "event_leads"("event_id", "email");

-- AddForeignKey
ALTER TABLE "event_leads" ADD CONSTRAINT "event_leads_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
