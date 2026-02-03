import { connectDB } from "@repo/db";

const MONGODB_URI = process.env.MONGODB_URI || "";

async function main() {
    await connectDB(MONGODB_URI);

    console.log("Connected to MongoDB");
    console.log("Scraping events...");

    await scrapeEvents();
    
    console.log("Events scraped successfully");

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});