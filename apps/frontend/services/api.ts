const API_BASE_URL = 'http://localhost:5000';

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  summary: string;
  venueName: string;
  venueAddress: string;
  city: string;
  category: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  dateTimeTimezone: string;
  imageUrl: string | null;
  posterUrl: string | null;
  sourceWebsite: string;
  sourceEventId: string | null;
  originalUrl: string;
  lastScrapedAt: string | null;
  status: 'new' | 'updated' | 'inactive' | 'imported';
  hash: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authenticate with Google OAuth
 */
export async function authenticateWithGoogle(credential: string): Promise<{ admin: { id: string; name: string; email: string; avatar?: string }; token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to authenticate with Google');
  }

  return response.json();
}

/**
 * Verify authentication token
 */
export async function verifyAuth(): Promise<{ admin: { id: string; name: string; email: string; avatar?: string } }> {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to verify authentication');
  }

  return response.json();
}

/**
 * Fetch unapproved events for admin dashboard
 */
export async function fetchAdminEvents(): Promise<ApiEvent[]> {
  const response = await fetch(`${API_BASE_URL}/admin/events`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }
    throw new Error(`Failed to fetch admin events: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch approved events for marketplace/public view
 */
export async function fetchApprovedEvents(): Promise<ApiEvent[]> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch approved events: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch imported events (approved events) for admin dashboard
 */
export async function fetchImportedEvents(): Promise<ApiEvent[]> {
  const response = await fetch(`${API_BASE_URL}/admin/imported/events`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }
    throw new Error(`Failed to fetch imported events: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Approve an event (mark as imported)
 */
export async function approveEvent(eventId: string): Promise<ApiEvent> {
  const response = await fetch(`${API_BASE_URL}/admin/event/${eventId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in again.');
    }
    throw new Error(`Failed to approve event: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create an event lead (save email when user clicks "Get Tickets")
 */
export interface CreateEventLeadRequest {
  email: string;
  consent: boolean;
  originalEventUrl?: string;
}

export interface EventLead {
  id: string;
  email: string;
  eventId: string;
  consent: boolean;
  redirectedAt: string | null;
  originalEventUrl: string;
  createdAt: string;
  updatedAt: string;
}

export async function createEventLead(
  eventId: string, 
  data: CreateEventLeadRequest
): Promise<EventLead> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/lead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Failed to save lead: ${response.statusText}`);
  }

  return response.json();
}

