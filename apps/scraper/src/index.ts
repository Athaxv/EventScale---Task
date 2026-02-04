import { scrapeEventbrite } from "./scraper/eventbrite.js";
import { connectDB } from "@repo/db";

async function main() {
    await connectDB();
    console.log("✅ Connected to database");
    console.log("🔍 Scraping events...");
    await scrapeEventbrite();
    console.log("✅ Scraped events");
}

main().catch(console.error);