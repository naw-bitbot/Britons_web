
import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowLeft, UserCircle, Settings } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import { View } from '../types';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (id: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'scrolled-header' : 'bg-white/90 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => onNavigate('home')}
          >
            <div className="relative overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
               <img src="/removals-to-spain-2.png" alt="Britons Removals to Spain" className="h-10 md:h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-800 leading-none">Removal to Spain</h1>
              <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-widest">Relocation Experts</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {currentView === 'home' ? (
              <>
                <button onClick={() => handleSectionClick('services')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Services</button>
                <button onClick={() => handleSectionClick('testimonials')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Reviews</button>
                <button onClick={() => handleSectionClick('contact')} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</button>
              </>
            ) : (
              <button 
                onClick={() => onNavigate('home')} 
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Home
              </button>
            )}

            <button 
              onClick={() => onNavigate('your-move')} 
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-bold transition-all ${currentView === 'your-move' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600'}`}
            >
              <UserCircle size={20} />
              <span>Your Move</span>
            </button>

            <button 
              onClick={() => onNavigate('admin')} 
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-bold transition-all ${currentView === 'admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              title="Staff Portal"
            >
              <Settings size={18} />
              <span className="text-xs uppercase tracking-tighter">Admin</span>
            </button>
            
            <button 
              onClick={() => onNavigate('quote')} 
              className={`px-5 py-2 rounded-full font-semibold transition-all shadow-md ${currentView === 'quote' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {currentView === 'quote' ? 'Calculator active' : 'Get a Quote'}
            </button>
            
            <div className="flex items-center space-x-4 border-l pl-6 ml-2 border-slate-200">
               <div className="flex items-center space-x-2 text-slate-700 font-bold">
                 <Phone size={18} className="text-blue-600" />
                 <span>{COMPANY_INFO.phone}</span>
               </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl animate-fade-in">
          <button onClick={() => onNavigate('home')} className="block w-full text-left py-2 text-slate-700 font-medium">Home</button>
          <button onClick={() => { onNavigate('your-move'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-slate-700 font-medium">Your Move (Client Portal)</button>
          <button onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-slate-500 font-medium text-xs uppercase tracking-widest">Admin Access</button>
          <button onClick={() => handleSectionClick('services')} className="block w-full text-left py-2 text-slate-700 font-medium">Services</button>
          <button onClick={() => handleSectionClick('contact')} className="block w-full text-left py-2 text-slate-700 font-medium">Contact</button>
          <button onClick={() => { onNavigate('quote'); setIsMenuOpen(false); }} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Get a Quote</button>
          <div className="flex items-center justify-center space-x-2 py-4 text-blue-600 font-bold">
            <Phone size={18} />
            <span>{COMPANY_INFO.phone}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
