import React from 'react';
import { Globe, RefreshCw, Layers, ShieldCheck, Ticket } from 'lucide-react';

const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
       <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Cross-Border Events</p>
          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9]">
            Global events <br />
            run on <span className="italic">EventScale.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Control ticket sales, tax, and more on one, simplified dashboard.
            We unify global compliance so you can scale from one platform.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Feature List */}
          <div className="space-y-12 py-8 border-l border-gray-200 pl-8">
             <div className="flex items-start space-x-4">
                <Globe className="text-gray-400 mt-1" />
                <div>
                   <h3 className="text-xl font-medium">Global Reach</h3>
                   <p className="text-gray-500 mt-2 text-sm leading-relaxed">Automatically localized currency and language support for 150+ countries.</p>
                </div>
             </div>
             <div className="flex items-start space-x-4">
                <RefreshCw className="text-gray-400 mt-1" />
                <div>
                   <h3 className="text-xl font-medium">Instant Refunds</h3>
                   <p className="text-gray-500 mt-2 text-sm leading-relaxed">Automated refund policies that keep attendees happy and reduce support tickets.</p>
                </div>
             </div>
             <div className="flex items-start space-x-4">
                <Layers className="text-gray-400 mt-1" />
                <div>
                   <h3 className="text-xl font-medium">Dynamic Inventory</h3>
                   <p className="text-gray-500 mt-2 text-sm leading-relaxed">Real-time seat mapping and tiered pricing structures updated instantly.</p>
                </div>
             </div>
             <div className="flex items-start space-x-4">
                <ShieldCheck className="text-brand-green mt-1" />
                <div>
                   <h3 className="text-xl font-medium">Fraud Protection</h3>
                   <p className="text-gray-500 mt-2 text-sm leading-relaxed">AI-driven fraud detection prevents scalping and fake tickets.</p>
                </div>
             </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="bg-gray-100 rounded-[3rem] p-8 md:p-12 relative overflow-hidden min-h-[500px] group">
             {/* Background Mesh */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
             
             {/* Abstract 3D Object Representation */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-900/10 rounded-full blur-3xl" />
             
             <img 
               src="https://picsum.photos/800/800?grayscale" 
               alt="Dashboard Visual" 
               className="relative z-10 rounded-2xl shadow-2xl transform transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2 rotate-1"
             />

             {/* Floating UI Card */}
             <div className="absolute top-12 right-12 z-20 bg-white p-4 rounded-xl shadow-lg animate-bounce duration-[3000ms]">
                <p className="text-xs text-gray-500 mb-1">"Where is my ticket?" queries</p>
                <div className="flex items-center space-x-2">
                   <span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded border border-red-100">-36%</span>
                   <span className="text-xs text-gray-400">vs. last week</span>
                </div>
             </div>

             {/* Floating UI Card 2 */}
             <div className="absolute bottom-12 left-12 z-20 bg-white p-5 rounded-xl shadow-lg w-64">
                <div className="space-y-4">
                   <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center">
                         <div className="w-2 h-2 bg-black rounded-full" />
                      </div>
                      <div>
                         <p className="text-xs font-bold">Ticket Issued</p>
                         <p className="text-[10px] text-gray-400">London - Sep 13, 10:21 AM</p>
                      </div>
                   </div>
                   <div className="h-4 border-l border-dashed border-gray-300 ml-2.5" />
                   <div className="flex items-start space-x-3 opacity-50">
                      <div className="w-5 h-5 rounded-full border border-gray-200" />
                      <div>
                         <p className="text-xs font-bold">Event Started</p>
                         <p className="text-[10px] text-gray-400">Pending</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

export default BentoGrid;