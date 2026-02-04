import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Event } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess: (email: string, consent: boolean) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, event, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Call the success handler which will handle the API call
    // The actual API call happens in EventMarketplace component
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(email.trim(), consent);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-serif font-semibold mb-2">Get Tickets</h3>
            <p className="text-sm text-gray-500">
              You are about to leave EventScale to book tickets for <span className="font-semibold text-black">{event.title}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
              </div>
              <label htmlFor="consent" className="text-xs text-gray-500 leading-snug">
                I agree to receive event updates and newsletters from EventScale. You can unsubscribe at any time.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-green hover:bg-green-300 text-black py-3.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-200/50 disabled:opacity-70"
            >
              <span>{isSubmitting ? 'Processing...' : 'Continue to Booking'}</span>
              {!isSubmitting && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-1.5 text-[10px] text-gray-400">
            <ShieldCheck size={12} />
            <span>Your data is secure and encrypted.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;