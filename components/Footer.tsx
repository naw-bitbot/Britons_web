
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, UserCircle, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import { View } from '../types';

interface FooterProps {
  onNavigate?: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (view: View, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(view);
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 items-start">
          {/* Brand Info */}
          <div className="flex flex-col items-start space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={(e) => handleNav('home', e)}>
              <div className="flex items-center justify-center">
                 <img src="/removals-to-spain-2.png" alt="Britons Removals" className="h-8 object-contain" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Britons Removals</h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs text-left">
              Serving the UK and Europe with professional relocation and storage services since 1988. We are experts in removals to and from Spain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-pink-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-red-600 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>

          {/* eCentre - Why Choose Us / Compliance */}
          <div className="flex flex-col items-start">
            <h3 className="text-slate-900 font-bold mb-6 text-lg">Our Standards</h3>
            <ul className="space-y-4 text-left">
              <li className="flex items-center space-x-2 text-slate-600 text-sm">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>Fully Insured (Goods In Transit)</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-600 text-sm">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>Customs Clearance Specialists</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-600 text-sm">
                <Award size={16} className="text-blue-600" />
                <span>Member of BAR (Recommended)</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-600 text-sm">
                <Award size={16} className="text-blue-600" />
                <span>Spanish Relocation Experts</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-slate-900 font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4 text-left">
              <li><a href="#" onClick={(e) => handleNav('home', e)} className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Home</a></li>
              <li><a href="#" onClick={(e) => handleNav('your-move', e)} className="text-blue-600 font-bold text-sm transition-colors flex items-center space-x-2"><UserCircle size={16}/><span>Your Move Portal</span></a></li>
              <li><a href="#services" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Services</a></li>
              <li><a href="#" onClick={(e) => handleNav('quote', e)} className="text-slate-900 font-bold text-sm transition-colors hover:text-blue-600">Free Quote Calculator</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start">
            <h3 className="text-slate-900 font-bold mb-6 text-lg">Contact Us</h3>
            <div className="space-y-4 w-full flex flex-col items-start">
              <div className="flex items-start space-x-3 text-sm text-left">
                <MapPin className="text-blue-600 shrink-0" size={18} />
                <span className="text-slate-600 max-w-[200px]">{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="text-blue-600 shrink-0" size={18} />
                <span className="text-slate-600 font-bold">{COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="text-blue-600 shrink-0" size={18} />
                <span className="text-slate-600">{COMPANY_INFO.email}</span>
              </div>
              <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full max-w-[240px] text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Our Website</p>
                <p className="text-lg font-bold text-blue-600">{COMPANY_INFO.website}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-start items-center space-y-4 md:space-y-0">
          <p className="text-slate-500 text-xs text-left">
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. Registered in England & Wales.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
