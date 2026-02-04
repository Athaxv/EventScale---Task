import React, { useState } from 'react';
import Navbar from './components/Navbar';
import InfiniteTicker from './components/InfiniteTicker';
import BentoGrid from './components/BentoGrid';
import Footer from './components/Footer';
import Stats from './components/Stats';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import EventMarketplace from './components/EventMarketplace';
import { Toaster, useToast } from './components/Sonner';
import { MOCK_EVENTS } from './constants';
import { Event } from './types';
import { getAIEventRecommendations } from './services/geminiService';
import { Sparkles, ArrowRight, Bird } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'admin' | 'marketplace'>('landing');
  const { toasts, addToast } = useToast();
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // This function now navigates to the marketplace view
  const handleBookClick = () => {
    setCurrentView('marketplace');
    window.scrollTo(0, 0);
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse(null);
    try {
        const result = await getAIEventRecommendations(aiPrompt);
        setAiResponse(result);
        addToast('AI Recommendations loaded', 'success');
    } catch (err) {
        addToast('Failed to fetch AI results', 'info');
    } finally {
        setIsAiLoading(false);
    }
  };

  if (currentView === 'admin') {
    return <AdminDashboard onLogout={() => setCurrentView('landing')} />;
  }

  if (currentView === 'login') {
    return <Login onBack={() => setCurrentView('landing')} onAdminLogin={() => setCurrentView('admin')} />;
  }

  if (currentView === 'marketplace') {
    return <EventMarketplace onBack={() => setCurrentView('landing')} onSignIn={() => setCurrentView('login')} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-green selection:text-black">
      <Navbar onSignInClick={() => setCurrentView('login')} onBookDemoClick={handleBookClick} />
      
      {/* Spacer for fixed nav */}
      <div className="h-24"></div>

      {/* Hero Section */}
      <section className="relative px-6 pt-10 pb-20 md:pt-20 md:pb-32 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight mb-8 tracking-tight">
          Commerce is complex. <br />
          <span className="italic">Take control.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          EventScale is the agentic commerce OS that unifies global compliance, returns, and inventory—so you can scale from one platform.
        </p>
        <div className="flex justify-center">
            <button 
                onClick={handleBookClick}
                className="bg-brand-green hover:bg-green-300 text-black text-lg px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-green-200/50"
            >
                Book a Demo
            </button>
        </div>
      </section>

      {/* Infinite Ticker */}
      <InfiniteTicker />

      {/* Main Content Image */}
      <section className="w-full px-4 md:px-10 mt-[-2rem] mb-20 relative z-10">
         <div className="bg-black rounded-[3rem] w-full h-[60vh] md:h-[80vh] overflow-hidden relative flex items-center justify-center">
            <h2 className="text-white text-[20vw] font-serif leading-none opacity-90 select-none pointer-events-none">
               Scale
            </h2>
            <div className="absolute bottom-10 left-10">
               <Bird className="text-white w-12 h-12" />
            </div>
             <div className="absolute bottom-10 right-10 bg-white p-4 rounded-full hover:scale-110 transition-transform cursor-pointer" onClick={handleBookClick}>
               <ArrowRight className="text-black w-6 h-6" />
            </div>
         </div>
      </section>

      <Stats />

      <BentoGrid />

      {/* Event Listing / AI Section */}
      <section className="bg-gray-50 py-24 px-6" id="ai">
         <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
                 <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1 mb-4">
                    <Sparkles size={14} className="text-purple-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">AI Labs</span>
                 </div>
                 <h2 className="text-4xl font-serif mb-4">Ask the Curator</h2>
                 <p className="text-gray-600">Not sure what to do tonight? Ask our AI.</p>
             </div>

             <form onSubmit={handleAiSearch} className="relative mb-12">
                 <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Find jazz concerts in Paris this weekend under $50'"
                    className="w-full p-6 pr-32 text-lg rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green shadow-sm"
                 />
                 <button 
                    type="submit"
                    disabled={isAiLoading}
                    className="absolute right-3 top-3 bottom-3 bg-black text-white px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                 >
                    {isAiLoading ? 'Thinking...' : 'Find'}
                 </button>
             </form>

             {aiResponse && (
                 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                     <h3 className="font-serif text-xl mb-4">Recommendations</h3>
                     <div className="prose prose-sm max-w-none text-gray-600">
                        {aiResponse.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                     </div>
                 </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                 {MOCK_EVENTS.slice(0, 4).map((event) => (
                     <div key={event.id} className="group bg-white p-4 rounded-3xl border border-gray-100 hover:border-gray-300 transition-all hover:shadow-xl cursor-pointer" onClick={handleBookClick}>
                         <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                             <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                                ${event.price}
                             </div>
                         </div>
                         <div className="px-2 pb-2">
                            <div className="text-xs font-bold text-brand-green uppercase tracking-wide mb-1">{event.category}</div>
                            <h3 className="text-xl font-serif mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center bg-brand-green/10">
          <h2 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
            Book a free, 15-minute demo <br/>
            with a real human person.
          </h2>
          <p className="text-gray-600 text-lg mb-10">See your operations streamlined by the power of EventScale.</p>
          <button 
            onClick={handleBookClick}
            className="bg-brand-green hover:bg-green-300 text-black px-10 py-4 rounded-full text-lg font-medium transition-transform transform hover:scale-105 shadow-xl shadow-green-200/50"
          >
            Book a Demo
          </button>
      </section>

      <Footer />

      <Toaster toasts={toasts} />
    </div>
  );
};

export default App;