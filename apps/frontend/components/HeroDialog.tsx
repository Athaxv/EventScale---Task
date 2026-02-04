import React, { useState } from 'react';
import { X, Calendar, MapPin, Ticket } from 'lucide-react';
import { Event } from '../types';

interface HeroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
}

const HeroDialog: React.FC<HeroDialogProps> = ({ isOpen, onClose, event }) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100">
        <div className="flex">
          {/* Left Panel (Image) */}
          <div className="hidden md:block w-1/3 bg-gray-100 relative">
             <img 
               src={event?.image || "https://picsum.photos/400/800"} 
               alt="Event" 
               className="absolute inset-0 w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">Featured Event</p>
                <h3 className="text-xl font-serif mt-1">{event?.title || "Select an Event"}</h3>
             </div>
          </div>

          {/* Right Panel (Content) */}
          <div className="w-full md:w-2/3 p-8 flex flex-col h-[500px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-serif mb-1">Book Tickets</h2>
                <p className="text-gray-500 text-sm">Secure your spot instantly.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-400 tracking-wide">Event Details</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <Calendar className="text-gray-400" size={18} />
                      <span className="text-sm font-medium">{event?.date || "Date TBA"}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <MapPin className="text-gray-400" size={18} />
                      <span className="text-sm font-medium">{event?.location || "Location TBA"}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase text-gray-400 tracking-wide">Select Ticket Type</label>
                    {['General Admission', 'VIP Access', 'Early Bird'].map((type, idx) => (
                      <div key={type} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-brand-green cursor-pointer transition-colors group">
                        <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${idx === 0 ? 'border-brand-green bg-brand-green' : 'border-gray-300 group-hover:border-brand-green'}`} />
                            <span className="font-medium text-sm">{type}</span>
                        </div>
                        <span className="font-serif italic text-gray-500">TBA</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 text-center pt-10">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket size={32} />
                   </div>
                   <h3 className="text-xl font-serif">You're all set!</h3>
                   <p className="text-gray-500 text-sm max-w-xs mx-auto">
                     Your tickets for {event?.title} have been reserved. Check your email for the QR code.
                   </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              {step === 1 ? (
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Checkout</span>
                  <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-200">TBA</span>
                </button>
              ) : (
                <button 
                  onClick={onClose}
                  className="w-full bg-brand-green text-black py-4 rounded-xl font-medium hover:bg-green-300 transition-colors"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDialog;