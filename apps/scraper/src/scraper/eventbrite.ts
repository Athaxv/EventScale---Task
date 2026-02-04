import { getPrisma } from "@repo/db";
import { createContentHash } from "../utils/hash.js";
import { safeParseEventDate } from "../utils/dateParser.js";
import { chromium } from "playwright";

const source_name = "Eventbrite";
const city = "Sydney";

export async function scrapeEventbrite() {
    const prisma = getPrisma();
    const scrapedIds = new Set<string>();

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log("🌐 Opening Eventbrite Sydney page...");
    await page.goto(`https://www.eventbrite.com/d/australia--sydney/all-events/`, { 
        waitUntil: "domcontentloaded",
        timeout: 30000 
    });

    // Wait a bit for JavaScript to render content
    await page.waitForTimeout(3000);

    // Scroll to load more content (Eventbrite uses lazy loading)
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(2000);

    // Debug: Check what's actually on the page
    const pageInfo = await page.evaluate(() => {
        const allLinks = document.querySelectorAll('a[href*="/e/"]');
        const eventCards = document.querySelectorAll('[data-testid*="event"], [class*="event-card"], [class*="EventCard"]');
        const sampleLinks = [];
        for (let i = 0; i < Math.min(5, allLinks.length); i++) {
            const a = allLinks[i];
            if (a) {
                const href = a.getAttribute("href");
                const text = a.textContent ? a.textContent.trim().substring(0, 50) : "";
                sampleLinks.push({ href, text });
            }
        }
        return {
            totalLinks: allLinks.length,
            eventCards: eventCards.length,
            sampleLinks: sampleLinks
        };
    });
    console.log(`📊 Page analysis:`, pageInfo);

    // Helper function to extract numeric event ID from URL slug
    function extractEventId(url: string): string | null {
        // Try to extract numeric ID from URL patterns like:
        // /e/event-name-tickets-1234567890
        // /e/1234567890
        const numericMatch = url.match(/-(\d{10,})/);
        if (numericMatch && numericMatch[1]) {
            return numericMatch[1];
        }
        // If URL is just numeric, use it directly
        const directMatch = url.match(/\/e\/(\d{10,})/);
        if (directMatch && directMatch[1]) {
            return directMatch[1];
        }
        return null;
    }

    // Helper function to normalize URL (remove query params, normalize domain)
    function normalizeUrl(url: string): string {
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://www.eventbrite.com${url}`);
            // Remove query params and hash
            urlObj.search = '';
            urlObj.hash = '';
            // Normalize domain to eventbrite.com (not eventbrite.com.au)
            urlObj.hostname = 'www.eventbrite.com';
            return urlObj.toString();
        } catch {
            return url;
        }
    }

    // Try multiple selectors to find event links
    const rawEventLinks = await page.evaluate(() => {
        const links: Array<{ id: string; url: string }> = [];
        const seenUrls = new Set<string>();
        
        // Strategy 1: Try data-event-id attribute (most reliable)
        const linksWithDataId = document.querySelectorAll<HTMLAnchorElement>('a[data-event-id]');
        linksWithDataId.forEach((a) => {
            const id = a.getAttribute("data-event-id");
            const url = a.getAttribute("href");
            if (id && url) {
                const normalizedUrl = url.startsWith('http') ? url : `https://www.eventbrite.com${url}`;
                if (!seenUrls.has(normalizedUrl)) {
                    seenUrls.add(normalizedUrl);
                    links.push({ id, url: normalizedUrl });
                }
            }
        });

        // Strategy 2: Try event card links (most common)
        const eventLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="/e/"]');
        eventLinks.forEach((a) => {
            const href = a.getAttribute("href");
            if (href) {
                const normalizedUrl = href.startsWith('http') ? href : `https://www.eventbrite.com${href}`;
                if (!seenUrls.has(normalizedUrl)) {
                    seenUrls.add(normalizedUrl);
                    const match = href.match(/\/e\/([^\/\?]+)/);
                    if (match && match[1]) {
                        links.push({ id: match[1], url: normalizedUrl });
                    }
                }
            }
        });

        return links;
    });

    // Deduplicate and normalize event links
    const eventLinksMap = new Map<string, { id: string; url: string }>();
    const normalizedUrlsSeen = new Set<string>();

    for (const link of rawEventLinks) {
        const normalizedUrl = normalizeUrl(link.url);
        
        // Skip if we've already seen this normalized URL
        if (normalizedUrlsSeen.has(normalizedUrl)) {
            continue;
        }

        // Extract numeric ID from URL if available (more reliable than slug)
        const numericId = extractEventId(link.url);
        const finalId = numericId || link.id;

        // Use numeric ID if available, otherwise use the slug
        eventLinksMap.set(normalizedUrl, {
            id: finalId,
            url: normalizedUrl
        });
        normalizedUrlsSeen.add(normalizedUrl);
    }

    const eventLinks = Array.from(eventLinksMap.values());

    console.log(`🔗 Found ${eventLinks.length} event links`);
    if (eventLinks.length > 0) {
        console.log(`   Sample: ${eventLinks.slice(0, 3).map(l => l.id).join(', ')}`);
    }

    console.log(`\n📝 Starting to scrape ${eventLinks.length} events...\n`);

    for (let i = 0; i < eventLinks.length; i++) {
        const eventLink = eventLinks[i];
        if (!eventLink) continue;
        
        const { id, url } = eventLink;
        if (!id || !url || scrapedIds.has(id)) continue;

        scrapedIds.add(id);
        console.log(`[${i + 1}/${eventLinks.length}] Scraping event ${id}...`);

        const eventPage = await browser.newPage();
        try {
            // Use domcontentloaded instead of networkidle for faster loading
            await eventPage.goto(url, { 
                waitUntil: "domcontentloaded",
                timeout: 20000 
            });

            // Wait a bit for JavaScript to render
            await eventPage.waitForTimeout(2000);

            // Wait for page content to load
            await eventPage.waitForSelector("h1", { timeout: 5000 }).catch(() => {
                console.warn(`   ⚠️  Could not find title for event ${id}`);
            });

            // Extract event data using Playwright's built-in methods to avoid serialization issues
            const titleEl = await eventPage.$("h1");
            const title = titleEl ? await titleEl.textContent() || "" : "";
            
            const descEl = await eventPage.$('[data-testid="event-description"]') || 
                          await eventPage.$('.event-description') ||
                          await eventPage.$('p');
            const description = descEl ? await descEl.textContent() || "" : "";

            // Try multiple strategies to get event date/time
            let dateTime = "";
            
            // Strategy 1: Look for datetime attribute (ISO format - most reliable)
            const timeEl = await eventPage.$("time[datetime]");
            if (timeEl) {
                dateTime = await timeEl.getAttribute("datetime") || "";
            }
            
            // Strategy 2: Look for structured data or JSON-LD
            if (!dateTime) {
                const jsonLdScripts = await eventPage.$$('script[type="application/ld+json"]');
                for (const script of jsonLdScripts) {
                    const content = await script.textContent();
                    if (content) {
                        try {
                            const jsonLd = JSON.parse(content);
                            if (jsonLd['@type'] === 'Event' && jsonLd.startDate) {
                                dateTime = jsonLd.startDate;
                                break;
                            }
                        } catch (e) {
                            // Ignore JSON parse errors
                        }
                    }
                }
            }
            
            // Strategy 3: Look for data-testid="event-date"
            if (!dateTime) {
                const dateEl = await eventPage.$('[data-testid="event-date"]');
                if (dateEl) {
                    dateTime = await dateEl.textContent() || "";
                }
            }
            
            // Strategy 4: Look for any time element
            if (!dateTime) {
                const timeElFallback = await eventPage.$("time");
                if (timeElFallback) {
                    dateTime = await timeElFallback.getAttribute("datetime") || 
                              (await timeElFallback.textContent())?.trim() || "";
                }
            }
            
            // Strategy 5: Look for date in meta tags
            if (!dateTime) {
                const metaDate = await eventPage.$('meta[property="event:start_time"]');
                if (metaDate) {
                    dateTime = await metaDate.getAttribute("content") || "";
                }
            }

            const venueNameEl = await eventPage.$('[data-testid="venue-name"]') ||
                              await eventPage.$('.venue-name');
            const venueName = venueNameEl ? await venueNameEl.textContent() || "" : "";

            const venueAddressEl = await eventPage.$('[data-testid="venue-address"]') ||
                                  await eventPage.$('.venue-address');
            const venueAddress = venueAddressEl ? await venueAddressEl.textContent() || "" : "";

            const imageEl = await eventPage.$('[data-testid="event-image"] img') ||
                           await eventPage.$('.event-image img') ||
                           await eventPage.$('img[alt*="event"]') ||
                           await eventPage.$('img');
            const imageUrl = imageEl ? await imageEl.getAttribute("src") : null;

            const data = {
                title: title.trim(),
                description: description.trim(),
                dateTime: dateTime.trim(),
                venueName: venueName.trim(),
                venueAddress: venueAddress.trim(),
                imageUrl: imageUrl,
            };

            if (!data.title) {
                console.warn(`⚠️  Skipping event ${id}: No title found`);
                continue;
            }

            // Parse date using improved date parser
            const { start: dateTimeStart, end: dateTimeEnd } = safeParseEventDate(
                data.dateTime || null,
                "Australia/Sydney"
            );

            const resp = {
                title: data.title,
                description: data.description || data.title,
                summary: data.description.length > 200 ? data.description.substring(0, 200).trim() + "..." : (data.description || data.title.substring(0, 200)),
                venueName: data.venueName || "TBA",
                venueAddress: data.venueAddress || "",
                city: city,
                category: "General",
                dateTimeStart,
                dateTimeEnd,
                dateTimeTimezone: "Australia/Sydney",
                imageUrl: data.imageUrl,
                posterUrl: data.imageUrl,
                sourceWebsite: source_name,
                sourceEventId: id,
                originalUrl: url.startsWith('http') ? url : `https://www.eventbrite.com${url}`,
            };

            const hash = createContentHash(resp);
            const normalizedOriginalUrl = normalizeUrl(resp.originalUrl);

            // Check for existing event by sourceEventId first
            let existingEvent = await prisma.event.findUnique({
                where: {
                    sourceEventId_sourceWebsite: {
                        sourceEventId: id,
                        sourceWebsite: source_name,
                    },
                }
            });

            // Also check by originalUrl to catch duplicates with different IDs
            if (!existingEvent) {
                existingEvent = await prisma.event.findFirst({
                    where: {
                        originalUrl: normalizedOriginalUrl,
                        sourceWebsite: source_name,
                    }
                });
            }

            if (!existingEvent) {
                try {
                    await prisma.event.create({
                        data: {
                            ...resp,
                            originalUrl: normalizedOriginalUrl,
                            hash,
                            status: "new",
                            isApproved: false,
                            lastScrapedAt: new Date(),
                        }
                    });
                    console.log(`   ✅ Created new event: ${data.title.substring(0, 40)}...`);
                } catch (createError: any) {
                    // Handle unique constraint violation on originalUrl
                    if (createError.code === 'P2002' && createError.meta?.target?.includes('original_url')) {
                        // Event already exists with this URL, try to update it
                        const existingByUrl = await prisma.event.findFirst({
                            where: {
                                originalUrl: normalizedOriginalUrl,
                                sourceWebsite: source_name,
                            }
                        });
                        if (existingByUrl) {
                            await prisma.event.update({
                                where: { id: existingByUrl.id },
                                data: {
                                    ...resp,
                                    hash,
                                    status: "updated",
                                    lastScrapedAt: new Date(),
                                }
                            });
                            console.log(`   🔄 Updated existing event (by URL): ${data.title.substring(0, 40)}...`);
                        } else {
                            console.warn(`   ⚠️  Skipped duplicate URL: ${data.title.substring(0, 40)}...`);
                        }
                    } else {
                        throw createError;
                    }
                }
            } else if (existingEvent.hash !== hash) {
                await prisma.event.update({
                    where: {
                        id: existingEvent.id,
                    },
                    data: {
                        ...resp,
                        originalUrl: normalizedOriginalUrl,
                        hash,
                        status: "updated",
                        lastScrapedAt: new Date(),
                    }
                });
                console.log(`   🔄 Updated event: ${data.title.substring(0, 40)}...`);
            } else {
                await prisma.event.update({
                    where: {
                        id: existingEvent.id,
                    },
                    data: {
                        lastScrapedAt: new Date(),
                    }
                });
                console.log(`   ✓ Already up to date: ${data.title.substring(0, 40)}...`);
            }
        } catch (error: any) {
            if (error.name === 'TimeoutError') {
                console.error(`   ⏱️  Timeout scraping event ${id} (${url.substring(0, 60)}...)`);
            } else {
                console.error(`   ❌ Error scraping event ${id}:`, error.message || error);
            }
        }
        finally {
            await eventPage.close();
        }

        // Small delay between requests to be respectful
        if (i < eventLinks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    await prisma.event.updateMany({
        where: {
          sourceWebsite: source_name,
          sourceEventId: { notIn: Array.from(scrapedIds) },
        },
        data: { status: "inactive" },
      });
    
      await browser.close();
      console.log("✅ Eventbrite scraping complete");
}
