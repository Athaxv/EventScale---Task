import { scrapeEventbrite } from "./scraper/eventbrite.js";
import { connectDB } from "@repo/db";

let isRunning = false;

export async function runScraper(): Promise<{ success: boolean; message: string }> {
    if (isRunning) {
        return {
            success: false,
            message: "Scraper already running, please wait for current run to complete"
        };
    }

    isRunning = true;
    try {
        await connectDB();
        console.log("🔍 Scraping events...");
        await scrapeEventbrite();
        console.log("✅ Scraped events");
        return {
            success: true,
            message: "Scraper completed successfully"
        };
    } catch (error) {
        console.error("❌ Scraper failed", error);
        return {
            success: false,
            message: `Scraper failed: ${error instanceof Error ? error.message : String(error)}`
        };
    } finally {
        isRunning = false;
    }
}

export function isScraperRunning(): boolean {
    return isRunning;
}
