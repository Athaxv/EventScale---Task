import { Stat, MenuItem } from './types';

export const NAV_ITEMS: MenuItem[] = [
  { label: 'Events', href: '#events', subItems: ['Concerts', 'Tech', 'Art', 'Workshops'] },
  { label: 'Locations', href: '#locations', subItems: ['New York', 'London', 'Berlin', 'Tokyo'] },
  { label: 'Resources', href: '#resources' },
  { label: 'AI Planner', href: '#ai' },
];

export const HERO_STATS: Stat[] = [
  { value: "15k+", label: "Events Scraped", description: "Real-time updates from over 500 sources daily." },
  { value: "2.4s", label: "Booking Time", description: "The fastest checkout flow in the industry." },
  { value: "99%", label: "Satisfaction", description: "Users love the simplicity of EventScale." }
];