export type EventStatus = 'new' | 'updated' | 'inactive' | 'imported';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  tags: string[];
  status?: EventStatus;
  importedAt?: string;
  importedBy?: string;
  importNotes?: string;
  description?: string;
  sourceUrl?: string;
}

export interface Stat {
  value: string;
  label: string;
  description: string;
}

export interface MenuItem {
  label: string;
  href: string;
  subItems?: string[];
}