import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import AdminSidebar from './AdminSidebar';
import { Search, MapPin, Calendar, Filter, MoreHorizontal, ArrowUpRight, RefreshCw, Archive, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Event, EventStatus } from '../../types';
import { fetchAdminEvents, fetchImportedEvents, approveEvent } from '../../services/api';
import { transformApiEvents } from '../../utils/eventTransformer';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch different events based on active tab
        const apiEvents = activeTab === 'imported' 
          ? await fetchImportedEvents()
          : await fetchAdminEvents();
        const transformedEvents = transformApiEvents(apiEvents);
        setEvents(transformedEvents);
        toast.success(`Loaded ${transformedEvents.length} ${activeTab === 'imported' ? 'imported' : 'pending'} events`);
      } catch (err: any) {
        console.error('Failed to fetch events:', err);
        const errorMessage = err.message?.includes('Unauthorized') 
          ? 'Session expired. Please log in again.'
          : 'Failed to load events. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [activeTab])

  // Extract unique locations for the filter dropdown
  const locations = useMemo(() => {
    return Array.from(new Set(events.map(e => e.location.split(',')[0].trim())));
  }, [events]);

  const handleImportEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const eventTitle = event?.title || 'Event';
    
    try {
      toast.loading(`Importing ${eventTitle}...`, { id: `import-${eventId}` });
      await approveEvent(eventId);
      
      toast.success(`Successfully imported "${eventTitle}"`, { id: `import-${eventId}` });
      
      // Refresh the list to remove approved events (only if on dashboard tab)
      if (activeTab === 'dashboard') {
        const apiEvents = await fetchAdminEvents();
        const transformedEvents = transformApiEvents(apiEvents);
        setEvents(transformedEvents);
      }
    } catch (err: any) {
      console.error('Failed to approve event:', err);
      toast.error(`Failed to import "${eventTitle}"`, { id: `import-${eventId}` });
      
      if (err.message?.includes('Unauthorized')) {
        toast.error('Session expired. Please log in again.');
        setTimeout(() => onLogout(), 2000);
      }
    }
  };

  // Filter Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Note: Tab filtering is handled by fetching different data sets,
      // so we don't need to filter by status here

      // Keyword Match
      const matchesKeyword = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // City Match
      const matchesCity = selectedCity ? event.location.includes(selectedCity) : true;

      // Date Match
      let matchesDate = true;
      if (dateRange.start) {
         const eventDate = new Date(event.date);
         const startDate = new Date(dateRange.start);
         if (eventDate < startDate) matchesDate = false;
      }
      if (dateRange.end) {
         const eventDate = new Date(event.date);
         const endDate = new Date(dateRange.end);
         if (eventDate > endDate) matchesDate = false;
      }

      return matchesKeyword && matchesCity && matchesDate;
    });
  }, [events, activeTab, searchQuery, selectedCity, dateRange]);

  const getStatusConfig = (status?: EventStatus) => {
    switch(status) {
      case 'new': 
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: AlertCircle, 
          label: 'New' 
        };
      case 'updated': 
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: RefreshCw, 
          label: 'Updated' 
        };
      case 'inactive': 
        return { 
          color: 'bg-gray-50 text-gray-500 border-gray-200', 
          icon: Archive, 
          label: 'Inactive' 
        };
      case 'imported': 
        return { 
          color: 'bg-green-50 text-green-700 border-green-200', 
          icon: CheckCircle, 
          label: 'Imported' 
        };
      default: 
        return { 
          color: 'bg-gray-50 text-gray-600 border-gray-100', 
          icon: AlertCircle, 
          label: 'Unknown' 
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-gray-900">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      
      <main className="ml-64 flex-1 p-8 md:p-12 max-w-7xl">
        {/* Header */}
        <header className="mb-10">
          <div>
             <h1 className="text-3xl font-serif font-medium mb-1">
               {activeTab === 'imported' ? 'Imported Events' : 'Dashboard'}
             </h1>
             <p className="text-gray-500 text-sm">Welcome back, Admin. Here is what's happening.</p>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
           {/* Keyword Search */}
           <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                 type="text" 
                 placeholder="Search events, artists..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
              />
           </div>

           <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

           {/* City Filter */}
           <div className="w-full md:w-48 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                 value={selectedCity}
                 onChange={(e) => setSelectedCity(e.target.value)}
                 className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-sm appearance-none cursor-pointer"
              >
                 <option value="">All Locations</option>
                 {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                 <ArrowUpRight size={12} className="text-gray-400 rotate-45" />
              </div>
           </div>

           {/* Date Filter */}
           <div className="w-full md:w-auto flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <Calendar className="text-gray-400" size={18} />
              <input 
                type="date" 
                className="bg-transparent text-sm focus:outline-none text-gray-600 w-28"
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span className="text-gray-300">-</span>
              <input 
                type="date" 
                className="bg-transparent text-sm focus:outline-none text-gray-600 w-28"
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
           </div>

           {/* Filter Action */}
           <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
              <Filter size={18} />
           </button>
        </div>

        {/* Table / List Section */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">
                {activeTab === 'imported' ? 'Imported Events List' : 'Live Events Feed'}
              </h3>
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">{filteredEvents.length} results</span>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-4 font-medium">Event Name</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Location</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="text-sm">
                   {isLoading ? (
                      <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Loading events...
                         </td>
                      </tr>
                   ) : error ? (
                      <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                            {error}
                         </td>
                      </tr>
                   ) : filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => {
                         const statusConfig = getStatusConfig(event.status);
                         const StatusIcon = statusConfig.icon;
                         
                         return (
                           <tr key={event.id} className="group hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0">
                              <td className="px-6 py-4">
                                 <div className="flex items-center space-x-4">
                                    <img 
                                      src={event.image} 
                                      alt={event.title} 
                                      className="w-10 h-10 rounded-lg object-cover shadow-sm"
                                    />
                                    <div>
                                       <div className="font-medium text-gray-900">{event.title}</div>
                                       <div className="text-xs text-gray-500">{event.category}</div>
                                       {event.importedAt && activeTab === 'imported' && (
                                         <div className="text-[10px] text-green-600 mt-1">
                                           Imported by {event.importedBy}
                                         </div>
                                       )}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 font-medium">
                                 {event.date}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                 <div className="flex items-center space-x-1.5">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{event.location}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                    <StatusIcon size={12} />
                                    <span className="capitalize">{statusConfig.label}</span>
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 {activeTab === 'imported' ? (
                                    <button className="text-gray-400 hover:text-black transition-colors">
                                       <MoreHorizontal size={20} />
                                    </button>
                                 ) : (
                                    <button 
                                      onClick={() => handleImportEvent(event.id)}
                                      className="inline-flex items-center space-x-1.5 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                      <Download size={12} />
                                      <span>Import</span>
                                    </button>
                                 )}
                              </td>
                           </tr>
                         );
                      })
                   ) : (
                      <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            {activeTab === 'imported' 
                              ? "No imported events found." 
                              : "No events found matching your filters."}
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
           </div>
           
           {/* Pagination Mock */}
           <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
              <span>Showing 1 to {filteredEvents.length} of {filteredEvents.length} entries</span>
              <div className="flex space-x-2">
                 <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                 <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;