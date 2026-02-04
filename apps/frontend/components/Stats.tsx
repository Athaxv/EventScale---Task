import React from 'react';
import { HERO_STATS } from '../constants';

const Stats: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
       <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Global Market Access</p>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight">
             Unlock margin, momentum, <br/> 
             and measurable growth.
          </h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {HERO_STATS.map((stat, idx) => (
             <div key={idx} className="space-y-4">
                <div className="text-7xl font-serif font-light">{stat.value}</div>
                <h3 className="text-lg font-medium">{stat.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{stat.description}</p>
             </div>
          ))}
       </div>
    </section>
  );
};

export default Stats;