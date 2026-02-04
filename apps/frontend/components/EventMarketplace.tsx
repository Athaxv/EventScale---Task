import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { Event } from '../types';
import { MapPin, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import TicketModal from './TicketModal';
import { useToast } from './Sonner';

interface EventMarketplaceProps {
  onBack: () => void;
  onSignIn: () => void;
}

const EventMarketplace: React.FC<EventMarketplaceProps> = ({ onBack, onSignIn }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { addToast } = useToast();

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleTicketSuccess = (email: string, consent: boolean) => {
    console.log(`Saving to DB: Email=${email}, Consent=${consent}, Event=${selectedEvent?.id}`);
    addToast("Redirecting to ticket provider...", "success");
    
    // Simulate redirection delay
    setTimeout(() => {
      if (selectedEvent?.sourceUrl) {
        window.open(selectedEvent.sourceUrl, '_blank');
      } else {
        window.open('https://example.com', '_blank');
      }
      setSelectedEvent(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Navbar onSignInClick={onSignIn} />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-black mb-4 flex items-center space-x-1">
             <ArrowRight className="rotate-180" size={14} />
             <span>Back to Home</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Discover Events</h1>
          <p className="text-gray-600 max-w-2xl">
            Curated experiences from around the globe. Book your next adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              {/* Image */}
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  ${event.price}
                </div>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {event.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-brand-green transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                  {event.description || "Join us for an unforgettable experience. Limited tickets available."}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-4">
                    <span>Source: {new URL(event.sourceUrl || 'https://example.com').hostname}</span>
                    <ExternalLink size={12} />
                  </div>
                  
                  <button 
                    onClick={() => handleGetTickets(event)}
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-gray-200"
                  >
                    <span>GET TICKETS</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <TicketModal 
          isOpen={!!selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          event={selectedEvent} 
          onSuccess={handleTicketSuccess} 
        />
      )}
    </div>
  );
};

export default EventMarketplace;