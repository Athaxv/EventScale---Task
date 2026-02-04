import { Event, EventStatus } from '../types';
import { ApiEvent } from '../services/api';

/**
 * Format a date string to a readable format
 * Example: "2024-10-12T19:00:00Z" -> "Oct 12, 2024 • 7:00 PM"
 */
function formatDate(dateString: string, timezone?: string): string {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    
    // Use timezone if provided
    if (timezone) {
      options.timeZone = timezone;
    }
    
    const formatted = date.toLocaleString('en-US', options);
    // Format: "Oct 12, 2024, 7:00 PM" -> "Oct 12, 2024 • 7:00 PM"
    return formatted.replace(', ', ' • ').replace(',', '');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date TBA';
  }
}

/**
 * Build location string from venue components
 */
function buildLocation(venueName: string, venueAddress: string, city: string): string {
  const parts: string[] = [];
  
  if (venueName && venueName.trim() && venueName !== 'TBA') {
    parts.push(venueName.trim());
  }
  
  if (venueAddress && venueAddress.trim()) {
    parts.push(venueAddress.trim());
  }
  
  if (city && city.trim()) {
    parts.push(city.trim());
  }
  
  return parts.length > 0 ? parts.join(', ') : 'Location TBA';
}

/**
 * Transform API event response to frontend Event type
 */
export function transformApiEventToFrontendEvent(apiEvent: ApiEvent): Event {
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    date: formatDate(apiEvent.dateTimeStart, apiEvent.dateTimeTimezone),
    location: buildLocation(apiEvent.venueName, apiEvent.venueAddress, apiEvent.city),
    category: apiEvent.category || 'General',
    image: apiEvent.imageUrl || apiEvent.posterUrl || 'https://picsum.photos/600/400?random=' + apiEvent.id,
    tags: [], // API doesn't provide tags, default to empty array
    status: apiEvent.status as EventStatus,
    description: apiEvent.description || apiEvent.summary || '',
    sourceUrl: apiEvent.originalUrl,
    // Optional fields for imported events
    importedAt: apiEvent.isApproved ? apiEvent.updatedAt : undefined,
    importedBy: apiEvent.isApproved ? 'Admin' : undefined,
  };
}

/**
 * Transform multiple API events
 */
export function transformApiEvents(apiEvents: ApiEvent[]): Event[] {
  return apiEvents.map(transformApiEventToFrontendEvent);
}

