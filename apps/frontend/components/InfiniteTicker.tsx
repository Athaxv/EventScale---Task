import React from 'react';
import { MOCK_EVENTS } from '../constants';
import { Sparkles } from 'lucide-react';

const InfiniteTicker: React.FC = () => {
  return (
    <div className="w-full bg-black text-brand-green py-4 overflow-hidden border-y border-gray-800 z-40 relative">
      <div className="flex whitespace-nowrap">
        {/* Loop 1 */}
        <div className="animate-marquee flex items-center min-w-full shrink-0 space-x-12 px-6">
          {[...MOCK_EVENTS, ...MOCK_EVENTS].map((event, idx) => (
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
           {[...MOCK_EVENTS, ...MOCK_EVENTS].map((event, idx) => (
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