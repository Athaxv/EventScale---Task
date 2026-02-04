import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  onSignInClick?: () => void;
  onBookDemoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignInClick, onBookDemoClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100 ${
        scrolled ? 'py-4 bg-white/90 backdrop-blur-md shadow-sm' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-serif font-semibold tracking-tight cursor-pointer" onClick={() => window.location.reload()}>
          EventScale
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="group relative cursor-pointer">
              <a 
                href={item.href} 
                className="flex items-center space-x-1 text-sm font-medium text-gray-800 hover:text-black transition-colors"
              >
                <span>{item.label}</span>
                {item.subItems && <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition-transform group-hover:rotate-180" />}
              </a>
              
              {/* Dropdown */}
              {item.subItems && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2">
                  {item.subItems.map(sub => (
                    <div key={sub} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors">
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={onSignInClick}
            className="text-sm font-medium text-gray-800 hover:text-black"
          >
            Sign in
          </button>
          <button 
            onClick={onBookDemoClick || (() => window.dispatchEvent(new CustomEvent('navigate-marketplace')))}
            className="bg-brand-green hover:bg-green-300 text-black px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-200/50"
          >
            Check out events
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col space-y-4 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="text-lg font-medium text-gray-900">
              {item.label}
            </div>
          ))}
          <div className="h-px bg-gray-100 my-2" />
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onSignInClick?.();
            }}
            className="w-full text-left font-medium"
          >
            Sign in
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              if(onBookDemoClick) onBookDemoClick();
            }}
            className="w-full bg-brand-green text-black py-3 rounded-full font-medium"
          >
            Check out events
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;