import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Event } from '../types';
import { fetchApprovedEvents } from '../services/api';
import { transformApiEvents } from '../utils/eventTransformer';

const InfiniteTicker: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const apiEvents = await fetchApprovedEvents();
        const transformedEvents = transformApiEvents(apiEvents);
        setEvents(transformedEvents);
      } catch (error) {
        console.error('Failed to load events for ticker:', error);
      }
    };
    loadEvents();
  }, []);

  // Duplicate events for seamless scrolling effect
  const displayEvents = events.length > 0 ? [...events, ...events] : [];

  if (displayEvents.length === 0) {
    return null; // Don't render ticker if no events
  }

  return (
    <div className="w-full bg-black text-brand-green py-4 overflow-hidden border-y border-gray-800 z-40 relative">
      <div className="flex whitespace-nowrap">
        {/* Loop 1 */}
        <div className="animate-marquee flex items-center min-w-full shrink-0 space-x-12 px-6">
          {displayEvents.map((event, idx) => (
            <div key={`t1-${event.id}-${idx}`} className="flex items-center space-x-3 group cursor-pointer">
              <Sparkles size={14} className="text-white opacity-50 group-hover:text-brand-green transition-colors" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300">Upcoming</span>
              <span className="font-serif text-xl text-brand-green group-hover:text-white transition-colors">{event.title}</span>
              <span className="text-sm font-mono text-gray-400">@ {event.location}</span>
            </div>
          ))}
        </div>
        {/* Loop 2 (Duplicate for seamless effect) */}
        <div className="animate-marquee flex items-center min-w-full shrink-0 space-x-12 px-6">
           {displayEvents.map((event, idx) => (
            <div key={`t2-${event.id}-${idx}`} className="flex items-center space-x-3 group cursor-pointer">
              <Sparkles size={14} className="text-white opacity-50 group-hover:text-brand-green transition-colors" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300">Upcoming</span>
              <span className="font-serif text-xl text-brand-green group-hover:text-white transition-colors">{event.title}</span>
              <span className="text-sm font-mono text-gray-400">@ {event.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteTicker;