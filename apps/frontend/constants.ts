import { Event, Stat, MenuItem } from './types';

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

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Neon Horizon Art Gala',
    date: 'Oct 12, 2024 • 7:00 PM',
    location: 'Brooklyn, NY',
    category: 'Art',
    price: 45,
    image: 'https://picsum.photos/600/400?random=1',
    tags: ['Exhibition', 'Contemporary'],
    status: 'new',
    description: 'An immersive experience featuring 20+ avant-garde light artists from around the globe.',
    sourceUrl: 'https://example.com/neon-gala'
  },
  {
    id: '2',
    title: 'FutureTech Summit',
    date: 'Nov 05, 2024 • 9:00 AM',
    location: 'San Francisco, CA',
    category: 'Tech',
    price: 299,
    image: 'https://picsum.photos/600/400?random=2',
    tags: ['AI', 'Networking'],
    status: 'imported',
    description: 'Join the brightest minds in AI and robotics for a 3-day conference on the future of work.',
    sourceUrl: 'https://example.com/future-tech'
  },
  {
    id: '3',
    title: 'Midnight Jazz Collective',
    date: 'Oct 28, 2024 • 10:30 PM',
    location: 'New Orleans, LA',
    category: 'Music',
    price: 30,
    image: 'https://picsum.photos/600/400?random=3',
    tags: ['Live', 'Jazz'],
    status: 'updated',
    description: 'A soulful night of improvisation and classic standards at the historic Blue Note hall.',
    sourceUrl: 'https://example.com/jazz'
  },
  {
    id: '4',
    title: 'Culinary Masters Workshop',
    date: 'Dec 01, 2024 • 11:00 AM',
    location: 'Chicago, IL',
    category: 'Food',
    price: 150,
    image: 'https://picsum.photos/600/400?random=4',
    tags: ['Cooking', 'Workshop'],
    status: 'inactive',
    description: 'Learn pasta making from Michelin-star chefs in this hands-on interactive workshop.',
    sourceUrl: 'https://example.com/culinary'
  },
   {
    id: '5',
    title: 'Startup Grind Global',
    date: 'Jan 15, 2025 • 8:30 AM',
    location: 'London, UK',
    category: 'Business',
    price: 120,
    image: 'https://picsum.photos/600/400?random=5',
    tags: ['Startup', 'Finance'],
    status: 'new',
    description: 'Connect with 5,000+ founders and investors in the heart of London.',
    sourceUrl: 'https://example.com/startup'
  }
];