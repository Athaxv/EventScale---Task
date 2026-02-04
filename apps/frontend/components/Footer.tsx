import React from 'react';
import { Bird, Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: CTA and Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <Bird className="w-8 h-8 text-black" />
                    <span className="text-2xl font-serif font-bold">EventScale</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
                    The operating system for <br/> 
                    <span className="italic text-gray-500">experiential commerce.</span>
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all"
                    />
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12">
                <div className="space-y-6">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Platform</h4>
                    <ul className="space-y-4">
                        {['Events', 'Locations', 'Pricing', 'API', 'Integrations'].map(item => (
                            <li key={item}>
                                <a href="#" className="text-gray-600 hover:text-black hover:underline decoration-brand-green underline-offset-4 transition-all">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-6">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Company</h4>
                    <ul className="space-y-4">
                        {['About', 'Careers', 'Blog', 'Press', 'Contact'].map(item => (
                            <li key={item}>
                                <a href="#" className="text-gray-600 hover:text-black hover:underline decoration-brand-green underline-offset-4 transition-all">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="space-y-6">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Socials</h4>
                    <ul className="space-y-4">
                        {[
                            { label: 'Twitter', icon: Twitter },
                            { label: 'Instagram', icon: Instagram },
                            { label: 'LinkedIn', icon: Linkedin }
                        ].map(item => (
                            <li key={item.label}>
                                <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-black group">
                                    <item.icon size={16} />
                                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} EventScale Inc. All rights reserved.
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-500">
                <a href="#" className="hover:text-black">Privacy Policy</a>
                <a href="#" className="hover:text-black">Terms of Service</a>
                <a href="#" className="hover:text-black">Sitemap</a>
            </div>
            <div className="hidden md:flex items-center space-x-1 text-xs font-medium bg-gray-50 px-3 py-1 rounded-full text-gray-400">
                <span>Designed with</span>
                <span className="text-brand-black">AI</span>
            </div>
        </div>

        {/* Large Typographic Element */}
        <div className="mt-20 select-none pointer-events-none opacity-[0.03] overflow-hidden">
            <h1 className="text-[12rem] md:text-[20rem] font-serif leading-none text-center whitespace-nowrap">
                EventScale
            </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;