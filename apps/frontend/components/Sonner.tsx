import React, { useEffect, useState } from 'react';
import { CheckCircle, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toasts, addToast };
};

export const Toaster: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="pointer-events-auto flex items-center space-x-3 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 py-3 rounded-xl animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} className="text-brand-green fill-green-100" />
          ) : (
            <Info size={18} className="text-blue-500" />
          )}
          <span className="text-sm font-medium text-gray-800">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};