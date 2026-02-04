import cron from "node-cron";
import { scrapeEventbrite } from "./scraper/eventbrite.js";
import { connectDB } from "@repo/db";

let isRunning = false;

async function runScraper() {
  if (isRunning) {
    console.log("⏭️ Scraper already running, skipping this cycle");
    return;
  }

  isRunning = true;
  try {
    await connectDB();
    console.log("🔍 Scraping events...");
    await scrapeEventbrite()
    console.log("✅ Scraped events");
  } catch (error) {
    console.error("❌ Scraper failed", error);
  } finally {
    isRunning = false;
  }
}

// 🔁 Run every 1 hour (at minute 0)
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Hourly cron triggered");
  await runScraper();
});

// 🚀 Run immediately on startup (recommended)
console.log("🚀 Starting scraper service");
runScraper();
