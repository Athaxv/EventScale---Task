/**
 * Parse Eventbrite date strings into Date objects
 * Handles various formats including ISO strings, relative dates, and text dates
 */
export function parseEventDate(dateString: string, timezone: string = "Australia/Sydney"): { start: Date; end: Date } {
    if (!dateString || !dateString.trim()) {
        throw new Error("Empty date string");
    }

    const trimmed = dateString.trim();
    
    // Try ISO 8601 format first (most common from datetime attributes)
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
        const startDate = new Date(trimmed);
        if (!isNaN(startDate.getTime())) {
            const endDate = new Date(startDate);
            // Default to 2 hours duration if no end time specified
            endDate.setHours(endDate.getHours() + 2);
            return { start: startDate, end: endDate };
        }
    }

    // Try parsing as standard Date string
    const parsedDate = new Date(trimmed);
    if (!isNaN(parsedDate.getTime())) {
        const endDate = new Date(parsedDate);
        endDate.setHours(endDate.getHours() + 2);
        return { start: parsedDate, end: endDate };
    }

    // Try to parse common date formats
    // Format: "Mon, Jan 15, 2024 at 7:00 PM"
    const commonFormatMatch = trimmed.match(/(\w{3}),?\s+(\w{3})\s+(\d{1,2}),?\s+(\d{4})\s+(?:at\s+)?(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (commonFormatMatch) {
        const [, , monthName, day, year, hour, minute, ampm] = commonFormatMatch;
        
        // Validate all required values are present
        if (!monthName || !day || !year || !hour || !minute || !ampm) {
            throw new Error(`Incomplete date match: ${trimmed}`);
        }
        
        const monthMap: Record<string, number> = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };
        const month = monthMap[monthName.toLowerCase()];
        if (month !== undefined) {
            let hour24 = parseInt(hour);
            const ampmUpper = ampm.toUpperCase();
            if (ampmUpper === 'PM' && hour24 !== 12) hour24 += 12;
            if (ampmUpper === 'AM' && hour24 === 12) hour24 = 0;
            
            const startDate = new Date(parseInt(year), month, parseInt(day), hour24, parseInt(minute));
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 2);
            return { start: startDate, end: endDate };
        }
    }

    // If all parsing fails, throw error
    throw new Error(`Unable to parse date: ${trimmed}`);
}

/**
 * Safely parse event date with fallback
 */
export function safeParseEventDate(dateString: string | null | undefined, timezone: string = "Australia/Sydney"): { start: Date; end: Date } {
    if (!dateString || !dateString.trim()) {
        // Return current date + 1 day as fallback
        const start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(18, 0, 0, 0); // Default to 6 PM
        const end = new Date(start);
        end.setHours(end.getHours() + 2);
        return { start, end };
    }

    try {
        return parseEventDate(dateString, timezone);
    } catch (error) {
        console.warn(`Failed to parse date "${dateString}":`, error);
        // Fallback to current date + 1 day
        const start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(18, 0, 0, 0);
        const end = new Date(start);
        end.setHours(end.getHours() + 2);
        return { start, end };
    }
}

