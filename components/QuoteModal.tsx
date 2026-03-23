
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import QuoteForm from './QuoteForm';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 right-0 p-4 bg-white/80 backdrop-blur-md flex justify-end z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-900 transition-all"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 md:p-12 pt-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Request a Free Quote</h2>
            <p className="text-slate-500">Fast, reliable, and expert removals to Spain.</p>
          </div>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
