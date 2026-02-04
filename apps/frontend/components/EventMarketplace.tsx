import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Event } from '../types';
import { MapPin, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import TicketModal from './TicketModal';
import { fetchApprovedEvents, createEventLead } from '../services/api';
import { transformApiEvents } from '../utils/eventTransformer';

const EventMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiEvents = await fetchApprovedEvents();
        // Double-check: filter to ensure only approved events are displayed
        const approvedEvents = apiEvents.filter(event => event.isApproved === true);
        const transformedEvents = transformApiEvents(approvedEvents);
        setEvents(transformedEvents);
      } catch (err: any) {
        console.error('Failed to fetch events:', err);
        const errorMessage = 'Failed to load events. Please try again.';
        setError(errorMessage);
        toast.error('Failed to load events', {
          description: 'Please refresh the page or try again later'
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  

  const handleGetTickets = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleTicketSuccess = async (email: string, consent: boolean) => {
    if (!selectedEvent?.id) {
      toast.error('Event not found');
      return;
    }

    try {
      // Save email to database
      await createEventLead(selectedEvent.id, {
        email,
        consent,
        originalEventUrl: selectedEvent.sourceUrl
      });

      toast.success('Redirecting to ticket provider...', {
        description: `Opening ${selectedEvent.title} tickets`
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        if (selectedEvent.sourceUrl) {
          window.open(selectedEvent.sourceUrl, '_blank');
        } else {
          window.open('https://example.com', '_blank');
        }
        setSelectedEvent(null);
      }, 500);
    } catch (error: any) {
      console.error('Failed to save lead:', error);
      toast.error('Failed to save your information', {
        description: error.message || 'Please try again'
      });
      // Still redirect even if save fails
      setTimeout(() => {
        if (selectedEvent.sourceUrl) {
          window.open(selectedEvent.sourceUrl, '_blank');
        }
        setSelectedEvent(null);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Navbar onSignInClick={() => navigate('/login')} />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-black mb-4 flex items-center space-x-1">
             <ArrowRight className="rotate-180" size={14} />
             <span>Back to Home</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Discover Events</h1>
          <p className="text-gray-600 max-w-2xl">
            Curated experiences from around the globe. Book your next adventure.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading events...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No events available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                {/* Image */}
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
        )}
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